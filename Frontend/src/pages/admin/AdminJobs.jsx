import { useState } from "react";
import { useJobs } from "../../hooks/useJobs";
import { jobsApi, slugify } from "../../lib/api";

function Modal({ title, onClose, children }) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-head">
          <h3>{title}</h3>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}

function JobForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [location, setLocation] = useState(initial?.location || "");
  const [type, setType] = useState(initial?.type || "Full Time");
  const [remote, setRemote] = useState(initial?.remote || false);
  const [salary, setSalary] = useState(initial?.salary || "");
  const [companyName, setCompanyName] = useState(initial?.companyName || "Luxuz Consult International");
  const [applicationDeadline, setApplicationDeadline] = useState(initial?.applicationDeadline || "");
  const [filled, setFilled] = useState(initial?.filled || false);
  const [description, setDescription] = useState(initial?.description || "");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      title, location, type, remote, salary: salary || undefined,
      companyName, applicationDeadline: applicationDeadline || undefined,
      filled, description,
    };
    try {
      if (isEdit) {
        await onSave(payload);
      } else {
        await onSave({ id: slugify(title), ...payload });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="field">
          <label>Title<span className="req">*</span></label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="field">
          <label>Location<span className="req">*</span></label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label>Type<span className="req">*</span></label>
          <input value={type} onChange={(e) => setType(e.target.value)} required />
        </div>
        <div className="field">
          <label>Salary</label>
          <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Optional" />
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label>Company name<span className="req">*</span></label>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        </div>
        <div className="field">
          <label>Application deadline</label>
          <input
            type="date"
            value={applicationDeadline}
            onChange={(e) => setApplicationDeadline(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="admin-checkbox-row" style={{ flexDirection: "row" }}>
        <label>
          <input type="checkbox" checked={remote} onChange={(e) => setRemote(e.target.checked)} />
          Remote
        </label>
        <label>
          <input type="checkbox" checked={filled} onChange={(e) => setFilled(e.target.checked)} />
          Filled (hidden from public listings)
        </label>
      </div>
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

export default function AdminJobs() {
  const { data: jobs, loading, error, refetch } = useJobs();
  const [modal, setModal] = useState(null); // "create" | { edit: job } | { delete: job }
  const [busyError, setBusyError] = useState(null);

  const closeModal = () => setModal(null);

  const createJob = async (data) => {
    await jobsApi.create(data);
    await refetch();
    closeModal();
  };

  const updateJob = async (data) => {
    await jobsApi.update(modal.edit.id, data);
    await refetch();
    closeModal();
  };

  const deleteJob = async (job) => {
    try {
      await jobsApi.delete(job.id);
      await refetch();
    } catch (err) {
      setBusyError(err.message);
    }
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Jobs</h1>
          <p className="admin-page-sub">Manage open positions shown on the Career page.</p>
        </div>
        <button className="btn-primary" onClick={() => setModal("create")}>+ New job</button>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div className="error">Couldn't load jobs: {error.message}</div>}
      {busyError && <div className="error">{busyError}</div>}

      {jobs && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.location}{job.remote ? " · Remote" : ""}</td>
                <td className="mono">{job.type}</td>
                <td>
                  <span className={`admin-pill ${job.filled ? "admin-pill-muted" : "admin-pill-live"}`}>
                    {job.filled ? "Filled" : "Open"}
                  </span>
                </td>
                <td className="admin-row-actions">
                  <button onClick={() => setModal({ edit: job })}>Edit</button>
                  <button className="admin-danger-link" onClick={() => setModal({ delete: job })}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal === "create" && (
        <Modal title="New job" onClose={closeModal}>
          <JobForm onSave={createJob} onCancel={closeModal} />
        </Modal>
      )}

      {modal?.edit && (
        <Modal title={`Edit ${modal.edit.title}`} onClose={closeModal}>
          <JobForm initial={modal.edit} onSave={updateJob} onCancel={closeModal} />
        </Modal>
      )}

      {modal?.delete && (
        <Modal title={`Delete ${modal.delete.title}?`} onClose={closeModal}>
          <p>This can't be undone.</p>
          <div className="admin-modal-actions">
            <button className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button
              className="admin-btn-danger btn-primary"
              onClick={() => { deleteJob(modal.delete); closeModal(); }}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
