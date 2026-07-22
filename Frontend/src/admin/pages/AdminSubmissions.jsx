import { useState } from "react";
import { useStore, submissionsApi } from "../../lib/store";
import ConfirmDialog from "../components/ConfirmDialog";

const tabs = [
  { key: "contact", label: "Contact messages" },
  { key: "quote", label: "Quote requests" },
  { key: "jobApplication", label: "Job applications" },
];

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function EntrySummary({ bucket, entry }) {
  if (bucket === "contact") {
    return <>{entry.firstName} {entry.lastName} <span className="admin-entry-sub">{entry.email}</span></>;
  }
  if (bucket === "quote") {
    return <>{entry.companyName} <span className="admin-entry-sub">{entry.typeOfService}</span></>;
  }
  return <>{entry.fullName} <span className="admin-entry-sub">applied for {entry.jobTitle || "an unspecified role"}</span></>;
}

function EntryDetail({ entry }) {
  const skip = new Set(["id", "createdAt", "handled"]);
  const rows = Object.entries(entry).filter(([k, v]) => !skip.has(k) && v !== undefined && v !== null && v !== "");
  return (
    <dl className="admin-entry-detail">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="mono">{k}</dt>
          <dd>{String(v)}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function AdminSubmissions() {
  const { submissions } = useStore();
  const [tab, setTab] = useState("contact");
  const [openId, setOpenId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const entries = submissions[tab];

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow mono">/admin/submissions</span>
          <h1>Submissions</h1>
          <p className="admin-page-sub">
            Entries submitted through the Contact, Quote, and Job Application forms. Stored
            locally until the backend exists — see the TODOs in each form component.
          </p>
        </div>
      </div>

      <div className="admin-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={tab === t.key ? "on" : ""}
            onClick={() => { setTab(t.key); setOpenId(null); }}
          >
            {t.label}
            <span className="admin-tab-count mono">{submissions[t.key].length}</span>
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="empty">No {tabs.find((t) => t.key === tab).label.toLowerCase()} yet.</div>
      ) : (
        <div className="admin-list">
          {entries.map((entry) => (
            <div className="admin-entry" key={entry.id}>
              <button type="button" className="admin-entry-head" onClick={() => setOpenId(openId === entry.id ? null : entry.id)}>
                <span className={`admin-chevron ${openId === entry.id ? "open" : ""}`}>▸</span>
                {!entry.handled && <span className="admin-dot" aria-label="Unhandled" />}
                <span className="admin-entry-title"><EntrySummary bucket={tab} entry={entry} /></span>
                <span className="admin-entry-date mono">{formatDate(entry.createdAt)}</span>
              </button>

              {openId === entry.id && (
                <div className="admin-entry-body">
                  <EntryDetail entry={entry} />
                  <div className="admin-entry-actions">
                    <label className="admin-checkbox-row">
                      <input
                        type="checkbox"
                        checked={entry.handled}
                        onChange={(e) => submissionsApi.setHandled(tab, entry.id, e.target.checked)}
                      />
                      Mark as handled
                    </label>
                    <button type="button" className="admin-danger-link" onClick={() => setDeleteTarget(entry)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete submission?"
          message="This can't be undone."
          onConfirm={() => submissionsApi.delete(tab, deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
