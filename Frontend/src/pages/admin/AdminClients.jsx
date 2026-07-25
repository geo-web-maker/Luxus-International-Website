import { useState } from "react";
import { useClients } from "../../hooks/useClients";
import { clientsApi } from "../../lib/api";

function Modal({ title, onClose, children }) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-head">
          <h3>{title}</h3>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}

function ImageField({ image, onUpload, uploading, uploadError }) {
  const hasImage = image?.status === "confirmed" && image?.file;

  return (
    <div className="field field-full">
      <label>Logo</label>
      {hasImage ? (
        <div
          className="admin-image-preview"
          style={{
            background: "#EFEDE7",
            borderRadius: 6,
            padding: 12,
            display: "inline-block",
            marginBottom: 8,
          }}
        >
          <img src={image.file} alt="" style={{ maxWidth: 200, maxHeight: 100, display: "block" }} />
        </div>
      ) : (
        <div className="filetag mono" style={{ marginBottom: 8 }}>◻ no logo uploaded yet</div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
        disabled={uploading}
      />
      {uploading && <div className="mono" style={{ fontSize: 12, marginTop: 4 }}>Uploading…</div>}
      {uploadError && <div className="error">{uploadError}</div>}
      <div className="mono" style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6 }}>
        Shown on a light tile on the site, so any logo background works — no
        need to pre-edit it to transparent.
      </div>
    </div>
  );
}

function ClientForm({ initial, onSave, onUploadImage, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [displayOrder, setDisplayOrder] = useState(initial?.displayOrder ?? 0);
  const [active, setActive] = useState(initial?.active ?? true);
  const [image, setImage] = useState(initial?.image || null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const isEdit = Boolean(initial);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({ name, displayOrder: Number(displayOrder), active });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    setUploadError(null);
    try {
      const updated = await onUploadImage(file);
      setImage(updated.image);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="field">
        <label>Client name<span className="req">*</span></label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label>Display order</label>
        <input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
        />
        <div className="mono" style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
          Lower numbers appear first in the scrolling row.
        </div>
      </div>
      <div className="field">
        <label>
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Active (shown on the site)
        </label>
      </div>
      {isEdit ? (
        <ImageField image={image} onUpload={handleUpload} uploading={uploading} uploadError={uploadError} />
      ) : (
        <div className="field field-full">
          <label>Logo</label>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Save the client first, then edit it to upload a logo.
          </div>
        </div>
      )}
      {error && <div className="error">{error}</div>}
      <div className="admin-modal-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

export default function AdminClients() {
  const { data: clients, loading, error, refetch } = useClients(true);
  const [modal, setModal] = useState(null); // "create" | { edit: client } | { delete: client }
  const [busyError, setBusyError] = useState(null);

  const closeModal = () => setModal(null);

  const createClient = async (data) => {
    await clientsApi.create(data);
    await refetch();
    closeModal();
  };

  const saveClient = async (data) => {
    await clientsApi.update(modal.edit.id, data);
    await refetch();
    closeModal();
  };

  const uploadImage = async (file) => {
    const updated = await clientsApi.uploadImage(modal.edit.id, file);
    await refetch();
    return updated;
  };

  const deleteClient = async () => {
    try {
      await clientsApi.delete(modal.delete.id);
      await refetch();
      closeModal();
    } catch (err) {
      setBusyError(err.message);
    }
  };

  const sorted = [...(clients || [])].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Clients</h1>
          <p className="admin-page-sub">
            Manage the client/partner logos shown in the "Trusted by" row on the homepage.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setModal("create")}>
          + New client
        </button>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div className="error">Couldn't load clients: {error.message}</div>}
      {busyError && <div className="error">{busyError}</div>}

      {sorted.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Order</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((client) => {
              const hasImage = client.image?.status === "confirmed" && client.image?.file;
              return (
                <tr key={client.id}>
                  <td>
                    {hasImage ? (
                      <div style={{ background: "#EFEDE7", borderRadius: 4, padding: 6, display: "inline-block" }}>
                        <img src={client.image.file} alt="" style={{ height: 28, display: "block" }} />
                      </div>
                    ) : (
                      <span className="filetag mono">◻ pending</span>
                    )}
                  </td>
                  <td>{client.name}</td>
                  <td className="mono">{client.displayOrder}</td>
                  <td className="mono">{client.active ? "Active" : "Hidden"}</td>
                  <td className="admin-row-actions">
                    <button onClick={() => setModal({ edit: client })}>Edit</button>
                    <button className="admin-danger-link" onClick={() => setModal({ delete: client })}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {modal === "create" && (
        <Modal title="New client" onClose={closeModal}>
          <ClientForm onSave={createClient} onCancel={closeModal} />
        </Modal>
      )}

      {modal?.edit && (
        <Modal title={`Edit ${modal.edit.name}`} onClose={closeModal}>
          <ClientForm
            initial={modal.edit}
            onSave={saveClient}
            onUploadImage={uploadImage}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {modal?.delete && (
        <Modal title={`Delete ${modal.delete.name}?`} onClose={closeModal}>
          <p>This removes the client logo from the site. This can't be undone.</p>
          <div className="admin-modal-actions">
            <button className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="admin-btn-danger btn-primary" onClick={deleteClient}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
