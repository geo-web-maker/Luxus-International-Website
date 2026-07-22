import { useState } from "react";
import { useForm } from "react-hook-form";
import { useStore, contentApi, resetToSeed } from "../../lib/store";
import TagListInput from "../components/TagListInput";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminContent() {
  const { content } = useStore();
  const { company, coverageTags, navLinks } = content;
  const [tags, setTags] = useState(coverageTags);
  const [confirmReset, setConfirmReset] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting, isDirty }, reset } = useForm({
    defaultValues: company,
  });

  const onSubmitCompany = (data) => {
    contentApi.updateCompany(data);
    reset(data);
  };

  const saveTags = () => contentApi.setCoverageTags(tags);
  const tagsDirty = JSON.stringify(tags) !== JSON.stringify(coverageTags);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow mono">/admin/content</span>
          <h1>Site content</h1>
          <p className="admin-page-sub">Company details shown across the nav, footer, and Contact page, plus the homepage ISO coverage tags.</p>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Company info</h2>
        <form onSubmit={handleSubmit(onSubmitCompany)} noValidate>
          <div className="form-grid">
            <div className="field">
              <label>Full legal name</label>
              <input {...register("name")} />
            </div>
            <div className="field">
              <label>Short name</label>
              <input {...register("shortName")} />
            </div>
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Phone</label>
              <input className="mono" {...register("phone")} />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="mono" {...register("email")} />
            </div>
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Accreditation partner</label>
              <input {...register("accreditationPartner")} />
            </div>
            <div className="field">
              <label>Tagline</label>
              <input {...register("tagline")} />
            </div>
          </div>
          <div className="admin-modal-actions" style={{ justifyContent: "flex-start" }}>
            <button type="submit" className="btn-primary" disabled={isSubmitting || !isDirty}>
              Save company info
            </button>
          </div>
        </form>
      </div>

      <div className="admin-panel">
        <h2>ISO coverage tags</h2>
        <p className="admin-page-sub">Shown as the row of monospace tags under the homepage hero CTAs.</p>
        <TagListInput values={tags} onChange={setTags} placeholder="e.g. ISO 9001:2015" />
        <div className="admin-modal-actions" style={{ justifyContent: "flex-start" }}>
          <button type="button" className="btn-primary" disabled={!tagsDirty} onClick={saveTags}>
            Save coverage tags
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Nav links</h2>
        <p className="admin-page-sub">
          Read-only here — these map directly to routes defined in App.jsx, so changing labels
          without changing routing code would break navigation. Edit src/App.jsx and
          src/data/siteContent.js together if a route ever needs to change.
        </p>
        <table className="admin-table">
          <thead><tr><th>Label</th><th>Path</th></tr></thead>
          <tbody>
            {navLinks.map((l) => (
              <tr key={l.path}><td>{l.label}</td><td className="mono">{l.path}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-panel admin-panel-danger">
        <h2>Danger zone</h2>
        <p className="admin-page-sub">
          Resets services, jobs, and site content back to the original seed data and clears all
          submissions. Only affects this browser's local storage.
        </p>
        <button type="button" className="admin-btn-danger-outline" onClick={() => setConfirmReset(true)}>
          Reset all data to seed
        </button>
      </div>

      {confirmReset && (
        <ConfirmDialog
          title="Reset all data?"
          message="This clears every admin edit and submission in this browser and restores the original seed data from src/data/. This can't be undone."
          confirmLabel="Reset everything"
          onConfirm={resetToSeed}
          onClose={() => setConfirmReset(false)}
        />
      )}
    </>
  );
}
