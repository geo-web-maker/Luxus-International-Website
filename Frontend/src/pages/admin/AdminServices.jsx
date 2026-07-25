import { useState } from "react";
import { useServices } from "../../hooks/useServices";
import { servicesApi, slugify } from "../../lib/api";

function Modal({ title, wide, onClose, children }) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className={`admin-modal ${wide ? "admin-modal-wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
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
      <label>Photo</label>
      {hasImage ? (
        <div className="admin-image-preview">
          <img src={image.file} alt="" style={{ maxWidth: 200, maxHeight: 140, display: "block", marginBottom: 8 }} />
        </div>
      ) : (
        <div className="filetag mono" style={{ marginBottom: 8 }}>◻ no image uploaded yet</div>
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
    </div>
  );
}

function GroupForm({ initial, onSave, onUploadImage, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [shortName, setShortName] = useState(initial?.shortName || "");
  const [summary, setSummary] = useState(initial?.summary || "");
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
      if (isEdit) {
        await onSave({ name, shortName, summary });
      } else {
        await onSave({ slug: slugify(name), path: `/ser/${slugify(name)}`, name, shortName, summary });
      }
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
      const updatedGroup = await onUploadImage(file);
      setImage(updatedGroup.image);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="field">
        <label>Name<span className="req">*</span></label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label>Short name</label>
        <input value={shortName} onChange={(e) => setShortName(e.target.value)} />
      </div>
      <div className="field">
        <label>Summary</label>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
      </div>
      {isEdit ? (
        <ImageField image={image} onUpload={handleUpload} uploading={uploading} uploadError={uploadError} />
      ) : (
        <div className="field field-full">
          <label>Photo</label>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Save the group first, then edit it to upload a photo.
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

function BenefitsEditor({ benefits, onChange }) {
  const list = benefits || [];

  const update = (index, field, value) => {
    const next = list.map((b, i) => (i === index ? { ...b, [field]: value } : b));
    onChange(next);
  };

  const remove = (index) => {
    onChange(list.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...list, { id: "00", label: "", iconFile: "" }]);
  };

  return (
    <div>
      <label>Benefits</label>
      {list.map((b, i) => (
        <div className="admin-benefit-row" key={i}>
          <span className="admin-benefit-id mono">{String(i + 1).padStart(2, "0")}</span>
          <input
            placeholder="Label"
            value={b.label}
            onChange={(e) => update(i, "label", e.target.value)}
          />
          <input
            placeholder="Icon file"
            value={b.iconFile || ""}
            onChange={(e) => update(i, "iconFile", e.target.value)}
          />
          <button type="button" className="admin-icon-btn" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button type="button" className="btn-ghost admin-btn-small" onClick={add}>
        + Add benefit
      </button>
    </div>
  );
}

function ChildForm({ groupPath, initial, onSave, onUploadImage, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [shortName, setShortName] = useState(initial?.shortName || "");
  const [standardCode, setStandardCode] = useState(initial?.standardCode || "");
  const [note, setNote] = useState(initial?.note || "");
  const [benefits, setBenefits] = useState(initial?.benefits || []);
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
      const payload = {
        name,
        shortName: shortName || undefined,
        standardCode: standardCode || undefined,
        note: note || undefined,
        benefits,
      };
      if (isEdit) {
        await onSave(payload);
      } else {
        const slug = slugify(name);
        await onSave({ slug, path: `${groupPath}/${slug}`, ...payload });
      }
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
      const updatedGroup = await onUploadImage(file);
      const updatedChild = updatedGroup.children.find((c) => c.slug === initial.slug);
      setImage(updatedChild?.image || null);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="field">
          <label>Name<span className="req">*</span></label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field">
          <label>Short name</label>
          <input
            placeholder="Used on cards in place of the full name"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Standard code</label>
          <input
            placeholder="e.g. ISO 9001:2015"
            value={standardCode}
            onChange={(e) => setStandardCode(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label>Note</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <div className="field field-full">
        <BenefitsEditor benefits={benefits} onChange={setBenefits} />
      </div>
      {isEdit ? (
        <ImageField image={image} onUpload={handleUpload} uploading={uploading} uploadError={uploadError} />
      ) : (
        <div className="field field-full">
          <label>Photo</label>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Save the sub-service first, then edit it to upload a photo.
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

function ServiceGroupRow({ group, onRefetch }) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(null); // "edit-group" | "add-child" | { editChild } | "delete-group" | { deleteChild }
  const [busyError, setBusyError] = useState(null);

  const closeModal = () => setModal(null);

  const saveGroup = async (data) => {
    await servicesApi.updateGroup(group.slug, data);
    await onRefetch();
    closeModal();
  };

  const uploadGroupImage = async (file) => {
    const updatedGroup = await servicesApi.uploadGroupImage(group.slug, file);
    await onRefetch();
    return updatedGroup;
  };

  const uploadChildImage = async (childSlug, file) => {
    const updatedGroup = await servicesApi.uploadChildImage(group.slug, childSlug, file);
    await onRefetch();
    return updatedGroup;
  };

  const deleteGroup = async () => {
    try {
      await servicesApi.deleteGroup(group.slug);
      await onRefetch();
    } catch (err) {
      setBusyError(err.message);
    }
  };

  const saveChild = async (data) => {
    if (modal?.editChild) {
      await servicesApi.updateChild(group.slug, modal.editChild.slug, data);
    } else {
      await servicesApi.createChild(group.slug, data);
    }
    await onRefetch();
    closeModal();
  };

  const deleteChild = async (childSlug) => {
    try {
      await servicesApi.deleteChild(group.slug, childSlug);
      await onRefetch();
    } catch (err) {
      setBusyError(err.message);
    }
  };

  return (
    <div className="admin-group">
      <button className="admin-group-head" onClick={() => setOpen(!open)}>
        <span className={`admin-chevron ${open ? "open" : ""}`}>▸</span>
        <span className="admin-group-name">{group.name}</span>
        <span className="admin-group-count">{group.children?.length || 0} sub-services</span>
      </button>

      {open && (
        <div className="admin-group-body">
          <p className="admin-group-summary">{group.summary}</p>
          {busyError && <div className="error">{busyError}</div>}

          {group.children?.length > 0 && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Standard code</th>
                  <th>Benefits</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {group.children.map((child) => (
                  <tr key={child.slug}>
                    <td>{child.name}</td>
                    <td className="mono">{child.standardCode || "—"}</td>
                    <td>{child.benefits?.length || 0}</td>
                    <td className="admin-row-actions">
                      <button onClick={() => setModal({ editChild: child })}>Edit</button>
                      <button className="admin-danger-link" onClick={() => deleteChild(child.slug)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="admin-group-actions">
            <button className="btn-ghost admin-btn-small" onClick={() => setModal("edit-group")}>
              Edit group
            </button>
            <button className="btn-ghost admin-btn-small" onClick={() => setModal("add-child")}>
              + Add sub-service
            </button>
            <button className="admin-danger-link" onClick={() => setModal("delete-group")}>
              Delete group
            </button>
          </div>
        </div>
      )}

      {modal === "edit-group" && (
        <Modal title={`Edit ${group.name}`} onClose={closeModal}>
          <GroupForm initial={group} onSave={saveGroup} onUploadImage={uploadGroupImage} onCancel={closeModal} />
        </Modal>
      )}

      {modal === "add-child" && (
        <Modal title="Add sub-service" wide onClose={closeModal}>
          <ChildForm groupPath={group.path} onSave={saveChild} onCancel={closeModal} />
        </Modal>
      )}

      {modal?.editChild && (
        <Modal title={`Edit ${modal.editChild.name}`} wide onClose={closeModal}>
          <ChildForm
            groupPath={group.path}
            initial={modal.editChild}
            onSave={saveChild}
            onUploadImage={(file) => uploadChildImage(modal.editChild.slug, file)}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {modal === "delete-group" && (
        <Modal title={`Delete ${group.name}?`} onClose={closeModal}>
          <p>
            This removes the group and all {group.children?.length || 0} sub-services under it.
            This can't be undone.
          </p>
          <div className="admin-modal-actions">
            <button className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="admin-btn-danger btn-primary" onClick={() => { deleteGroup(); closeModal(); }}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function AdminServices() {
  const { data: services, loading, error, refetch } = useServices();
  const [showCreate, setShowCreate] = useState(false);

  const createGroup = async (data) => {
    await servicesApi.createGroup(data);
    await refetch();
    setShowCreate(false);
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Services</h1>
          <p className="admin-page-sub">
            Manage top-level service groups and their nested sub-services.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          + New group
        </button>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div className="error">Couldn't load services: {error.message}</div>}

      {services && (
        <div className="admin-list">
          {services.map((group) => (
            <ServiceGroupRow key={group.slug} group={group} onRefetch={refetch} />
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="New service group" onClose={() => setShowCreate(false)}>
          <GroupForm onSave={createGroup} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}
    </>
  );
}
