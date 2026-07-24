import { useEffect, useState } from "react";
import { useContent } from "../../hooks/useContent";
import { contentApi } from "../../lib/api";

function TagList({ tags, onChange }) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const trimmed = draft.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setDraft("");
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div>
      <div className="admin-taglist">
        {tags.length === 0 && <span className="admin-taglist-empty">No tags yet</span>}
        {tags.map((tag) => (
          <span className="admin-tag" key={tag}>
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>✕</button>
          </span>
        ))}
      </div>
      <div className="admin-taglist-add">
        <input
          placeholder="e.g. ISO 9001:2015"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <button type="button" className="btn-ghost admin-btn-small" onClick={addTag}>
          Add
        </button>
      </div>
    </div>
  );
}

export default function AdminContent() {
  const { data: content, loading, error, refetch } = useContent();

  const [company, setCompany] = useState(null);
  const [tags, setTags] = useState([]);
  const [savingCompany, setSavingCompany] = useState(false);
  const [savingTags, setSavingTags] = useState(false);
  const [companyError, setCompanyError] = useState(null);
  const [tagsError, setTagsError] = useState(null);
  const [savedMessage, setSavedMessage] = useState(null);

  // Seed local editable copies once the fetch resolves; refetching after a
  // save re-syncs both in case the backend normalized anything.
  useEffect(() => {
    if (content) {
      setCompany(content.company);
      setTags(content.isoCoverageTags || []);
    }
  }, [content]);

  const saveCompany = async (e) => {
    e.preventDefault();
    setSavingCompany(true);
    setCompanyError(null);
    try {
      await contentApi.updateCompany(company);
      await refetch();
      setSavedMessage("Company info saved.");
    } catch (err) {
      setCompanyError(err.message);
    } finally {
      setSavingCompany(false);
    }
  };

  const saveTags = async () => {
    setSavingTags(true);
    setTagsError(null);
    try {
      await contentApi.setCoverageTags(tags);
      await refetch();
      setSavedMessage("Coverage tags saved.");
    } catch (err) {
      setTagsError(err.message);
    } finally {
      setSavingTags(false);
    }
  };

  if (loading || !company) {
    return (
      <>
        <div className="admin-page-head"><h1>Site content</h1></div>
        <div>Loading…</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="admin-page-head"><h1>Site content</h1></div>
        <div className="error">Couldn't load content: {error.message}</div>
      </>
    );
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Site content</h1>
          <p className="admin-page-sub">Company info, and the ISO standards shown as coverage tags on the homepage.</p>
        </div>
      </div>

      {savedMessage && <div className="admin-panel">{savedMessage}</div>}

      <div className="admin-panel">
        <h2>Company info</h2>
        <form onSubmit={saveCompany}>
          <div className="form-grid">
            <div className="field">
              <label>Name</label>
              <input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Short name</label>
              <input value={company.shortName} onChange={(e) => setCompany({ ...company, shortName: e.target.value })} />
            </div>
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Phone</label>
              <input value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Accreditation partner</label>
            <input
              value={company.accreditationPartner}
              onChange={(e) => setCompany({ ...company, accreditationPartner: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Tagline</label>
            <input value={company.tagline} onChange={(e) => setCompany({ ...company, tagline: e.target.value })} />
          </div>
          {companyError && <div className="error">{companyError}</div>}
          <div className="admin-modal-actions" style={{ justifyContent: "flex-start" }}>
            <button type="submit" className="btn-primary" disabled={savingCompany}>
              {savingCompany ? "Saving…" : "Save company info"}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-panel">
        <h2>ISO coverage tags</h2>
        <p>Shown as the scrolling tag strip under the homepage hero.</p>
        <TagList tags={tags} onChange={setTags} />
        {tagsError && <div className="error">{tagsError}</div>}
        <div className="admin-modal-actions" style={{ justifyContent: "flex-start", marginTop: 14 }}>
          <button className="btn-primary" onClick={saveTags} disabled={savingTags}>
            {savingTags ? "Saving…" : "Save tags"}
          </button>
        </div>
      </div>
    </>
  );
}
