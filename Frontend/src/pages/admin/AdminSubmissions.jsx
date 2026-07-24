import { useState } from "react";
import { useSubmissions } from "../../hooks/useSubmissions";
import { submissionsApi } from "../../lib/api";

const TABS = [
  { key: "contact", label: "Contact" },
  { key: "quote", label: "Quotes" },
  { key: "jobApplication", label: "Job applications" },
];

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString();
}

function EntryDetail({ bucket, entry }) {
  if (bucket === "contact") {
    return (
      <dl className="admin-entry-detail">
        <dt>Name</dt><dd>{entry.firstName} {entry.lastName || ""}</dd>
        <dt>Email</dt><dd>{entry.email}</dd>
        <dt>Message</dt><dd>{entry.message}</dd>
      </dl>
    );
  }
  if (bucket === "quote") {
    return (
      <dl className="admin-entry-detail">
        <dt>Name</dt><dd>{entry.firstName} {entry.lastName || ""}</dd>
        <dt>Email</dt><dd>{entry.email}</dd>
        <dt>Phone</dt><dd>{entry.phone}</dd>
        <dt>Company</dt><dd>{entry.companyName}</dd>
        <dt>Website</dt><dd>{entry.companyWebsite || "—"}</dd>
        <dt>Sector</dt><dd>{entry.companySector}</dd>
        <dt>Service</dt><dd>{entry.typeOfService}</dd>
        <dt>Country</dt><dd>{entry.country}</dd>
        <dt>Employees</dt><dd>{entry.numberOfEmployees || "—"}</dd>
        <dt>Scope</dt><dd>{entry.companyScope || "—"}</dd>
      </dl>
    );
  }
  // jobApplication
  return (
    <dl className="admin-entry-detail">
      <dt>Name</dt><dd>{entry.fullName}</dd>
      <dt>Email</dt><dd>{entry.email}</dd>
      <dt>Phone</dt><dd>{entry.phone}</dd>
      <dt>Region</dt><dd>{entry.region}</dd>
      <dt>Message</dt><dd>{entry.message}</dd>
      <dt>Applying for</dt><dd>{entry.jobId || "—"}</dd>
      <dt>CV</dt>
      <dd>
        <a href={entry.cvUrl} target="_blank" rel="noreferrer">
          {entry.cvFilename}
        </a>
      </dd>
    </dl>
  );
}

function SubmissionEntry({ bucket, entry, onChanged }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const title =
    bucket === "jobApplication" ? entry.fullName : `${entry.firstName} ${entry.lastName || ""}`.trim();
  const sub = bucket === "quote" ? entry.companyName : entry.email;

  const toggleHandled = async () => {
    setBusy(true);
    setError(null);
    try {
      await submissionsApi.setHandled(bucket, entry.id, !entry.handled);
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    setError(null);
    try {
      await submissionsApi.delete(bucket, entry.id);
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-entry">
      <button className="admin-entry-head" onClick={() => setOpen(!open)}>
        {!entry.handled && <span className="admin-dot" />}
        <span className="admin-entry-title">
          {title}
          <span className="admin-entry-sub">{sub}</span>
        </span>
        <span className="admin-entry-date">{formatDate(entry.createdAt)}</span>
      </button>
      {open && (
        <div className="admin-entry-body">
          <EntryDetail bucket={bucket} entry={entry} />
          {error && <div className="error">{error}</div>}
          <div className="admin-entry-actions">
            <label className="admin-checkbox-row">
              <input type="checkbox" checked={entry.handled} onChange={toggleHandled} disabled={busy} />
              Handled
            </label>
            <button className="admin-danger-link" onClick={remove} disabled={busy}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSubmissions() {
  const [activeTab, setActiveTab] = useState("contact");
  const contact = useSubmissions("contact");
  const quote = useSubmissions("quote");
  const jobApplication = useSubmissions("jobApplication");

  const byTab = { contact, quote, jobApplication };
  const current = byTab[activeTab];

  const unhandledCount = (list) => (list || []).filter((e) => !e.handled).length;

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Submissions</h1>
          <p className="admin-page-sub">Contact messages, quote requests, and job applications from the public site.</p>
        </div>
      </div>

      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "on" : ""}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span className="admin-tab-count">{unhandledCount(byTab[tab.key].data)}</span>
          </button>
        ))}
      </div>

      {current.loading && <div>Loading…</div>}
      {current.error && <div className="error">Couldn't load submissions: {current.error.message}</div>}

      {current.data && (
        <div className="admin-list">
          {current.data.length === 0 && <p>No entries yet.</p>}
          {current.data.map((entry) => (
            <SubmissionEntry
              key={entry.id}
              bucket={activeTab}
              entry={entry}
              onChanged={current.refetch}
            />
          ))}
        </div>
      )}
    </>
  );
}
