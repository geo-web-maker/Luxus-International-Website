import { useState } from "react";
import { useStore, jobsApi } from "../../lib/store";
import JobModal from "./JobModal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminJobs() {
  const { jobs, content } = useStore();
  const [modal, setModal] = useState(null); // null | "new" | job
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow mono">/admin/jobs</span>
          <h1>Job listings</h1>
          <p className="admin-page-sub">Manages what shows on /career. Filled positions stay here but drop off the public listing.</p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setModal("new")}>+ Add job listing</button>
      </div>

      {jobs.length === 0 ? (
        <div className="empty">No job listings yet.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Deadline</th>
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
                <td className="mono">{job.applicationDeadline || "—"}</td>
                <td>
                  <span className={`admin-pill ${job.filled ? "admin-pill-muted" : "admin-pill-live"}`}>
                    {job.filled ? "Filled" : "Open"}
                  </span>
                </td>
                <td className="admin-row-actions">
                  <button type="button" onClick={() => setModal(job)}>Edit</button>
                  <button type="button" className="admin-danger-link" onClick={() => setDeleteTarget(job)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal && (
        <JobModal
          job={modal === "new" ? null : modal}
          existingIds={jobs.map((j) => j.id)}
          defaultCompanyName={content.company.name}
          onClose={() => setModal(null)}
          onSave={(data) => (modal === "new" ? jobsApi.create(data) : jobsApi.update(modal.id, data))}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete job listing?"
          message={`Delete "${deleteTarget.title}"? This can't be undone.`}
          onConfirm={() => jobsApi.delete(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
