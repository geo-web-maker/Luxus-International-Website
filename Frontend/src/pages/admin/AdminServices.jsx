import { useState } from "react";
import { useServices } from "../../hooks/useServices";
import { servicesApi, slugify, uploadsApi } from "../../lib/api";
import RichText from "../../components/ServiceSections/RichText";

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
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [image, setImage] = useState(initial?.image || null);
  const [sections, setSections] = useState(initial?.sections || []);
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
        await onSave({ name, shortName, summary, sections });
      } else {
        const finalSlug = slugTouched && slug ? slugify(slug) : slugify(name);
        await onSave({ slug: finalSlug, path: `/ser/${finalSlug}`, name, shortName, summary });
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
      {!isEdit && (
        <div className="field">
          <label>URL slug</label>
          <input
            placeholder={name ? slugify(name) : "e.g. msc"}
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
          />
          <div className="mono" style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
            Keep this short — it's the link people see, e.g. /ser/msc. Leave blank to auto-generate
            from the name. Can't be changed after saving.
          </div>
        </div>
      )}
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
      {isEdit ? (
        <div className="field field-full">
          <SectionsEditor sections={sections} onChange={setSections} />
        </div>
      ) : (
        <div className="field field-full">
          <label>Page content</label>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Save the group first, then edit it to add content sections. Only needed if this group
            has no sub-services and should show its own page (e.g. an "Asset Management" style page).
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

function ItemMediaUploader({ media, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const hasImage = media?.status === "confirmed" && media?.file;

  const handleUpload = async (file) => {
    setUploading(true);
    setUploadError(null);
    try {
      const { url } = await uploadsApi.uploadImage(file);
      onChange({ status: "confirmed", file: url });
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: 8 }}>
      {hasImage ? (
        <div style={{ background: "#EFEDE7", borderRadius: 4, padding: 6, display: "inline-block", marginBottom: 6 }}>
          <img src={media.file} alt="" style={{ height: 40, display: "block" }} />
        </div>
      ) : (
        <div className="filetag mono" style={{ marginBottom: 6 }}>◻ no {label} yet</div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
        disabled={uploading}
      />
      {uploading && <div className="mono" style={{ fontSize: 11 }}>Uploading…</div>}
      {uploadError && <div className="error">{uploadError}</div>}
    </div>
  );
}

function ContentGridItemsEditor({ layout, items, onChange }) {
  const update = (i, patch) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = () => onChange([...items, { id: `tmp-${Date.now()}`, heading: "", body: "", media: { status: "pending" } }]);

  const mediaLabel = layout === "photo-cards" ? "photo" : "icon";

  return (
    <div>
      {items.map((item, i) => (
        <div key={item.id || i} style={{ border: "1px solid var(--border-hairline)", borderRadius: 4, padding: 12, marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              placeholder="Heading"
              value={item.heading}
              onChange={(e) => update(i, { heading: e.target.value })}
              style={{ flex: 1 }}
            />
            <button type="button" className="admin-icon-btn" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
            <button type="button" className="admin-icon-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</button>
            <button type="button" className="admin-icon-btn" onClick={() => remove(i)}>✕</button>
          </div>
          <textarea
            placeholder={layout === "feature-rows" ? "Body — supports **bold** and \"- \" bullet lists" : "Short body text (optional)"}
            value={item.body || ""}
            onChange={(e) => update(i, { body: e.target.value })}
            style={{ marginBottom: 8, minHeight: layout === "feature-rows" ? 80 : 44 }}
          />
          <ItemMediaUploader media={item.media} onChange={(media) => update(i, { media })} label={mediaLabel} />
        </div>
      ))}
      <button type="button" className="btn-ghost admin-btn-small" onClick={add}>+ Add item</button>
    </div>
  );
}

function SectionEditorBody({ section, onChange }) {
  const [showPreview, setShowPreview] = useState(false);

  if (section.type === "richtext") {
    return (
      <div style={{ padding: "12px 0" }}>
        <div className="field">
          <label>Heading (optional)</label>
          <input value={section.heading || ""} onChange={(e) => onChange({ heading: e.target.value })} />
        </div>
        <div className="field">
          <label>Body</label>
          <textarea
            value={section.body || ""}
            onChange={(e) => onChange({ body: e.target.value })}
            style={{ minHeight: 120 }}
            placeholder={'Paragraphs separated by a blank line. "- " for bullets, "  - " for nested. **bold** for emphasis.'}
          />
        </div>
        <button type="button" className="btn-ghost admin-btn-small" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Hide preview" : "Show preview"}
        </button>
        {showPreview && (
          <div style={{ border: "1px dashed var(--border-hairline-dashed)", borderRadius: 4, padding: 12, marginTop: 8 }}>
            <RichText text={section.body} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "12px 0" }}>
      <div className="field">
        <label>Heading</label>
        <input value={section.heading || ""} onChange={(e) => onChange({ heading: e.target.value })} />
      </div>
      <div className="field">
        <label>Layout</label>
        <select value={section.layout || "icon-grid"} onChange={(e) => onChange({ layout: e.target.value })}>
          <option value="icon-grid">Icon grid — e.g. benefits, key principles, audience</option>
          <option value="photo-cards">Photo cards — e.g. sub-service showcase</option>
          <option value="feature-rows">Feature rows — icon + heading + rich text</option>
        </select>
      </div>
      <ContentGridItemsEditor
        layout={section.layout || "icon-grid"}
        items={section.items || []}
        onChange={(items) => onChange({ items })}
      />
    </div>
  );
}

function SectionsEditor({ sections, onChange }) {
  const list = sections || [];
  const [openIndex, setOpenIndex] = useState(null);

  const updateSection = (i, patch) => onChange(list.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const removeSection = (i) => { onChange(list.filter((_, idx) => idx !== i)); setOpenIndex(null); };
  const moveSection = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const addSection = (type) => {
    const base = type === "richtext"
      ? { id: `tmp-${Date.now()}`, type, heading: "", body: "" }
      : { id: `tmp-${Date.now()}`, type, heading: "", layout: "icon-grid", items: [] };
    onChange([...list, base]);
    setOpenIndex(list.length);
  };

  return (
    <div>
      <label>Page content sections</label>
      <div className="mono" style={{ fontSize: 11, color: "var(--text-secondary)", margin: "4px 0 10px" }}>
        These render in order on the public page — intro text, benefits, who-can-benefit, feature
        blocks, whatever the page needs. Add as many as you like, in any order.
      </div>
      {list.map((section, i) => (
        <div key={section.id || i} style={{ border: "1px solid var(--border-hairline)", borderRadius: 4, marginBottom: 8 }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer" }}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className={`admin-chevron ${openIndex === i ? "open" : ""}`}>▸</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--brand-blue)" }}>
              {section.type === "richtext" ? "Rich text" : `Content grid · ${section.layout || "icon-grid"}`}
            </span>
            <span style={{ flex: 1, fontSize: 13 }}>{section.heading || "(no heading)"}</span>
            <span onClick={(e) => e.stopPropagation()} style={{ display: "flex", gap: 4 }}>
              <button type="button" className="admin-icon-btn" onClick={() => moveSection(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" className="admin-icon-btn" onClick={() => moveSection(i, 1)} disabled={i === list.length - 1}>↓</button>
              <button type="button" className="admin-icon-btn" onClick={() => removeSection(i)}>✕</button>
            </span>
          </div>
          {openIndex === i && (
            <div style={{ padding: "0 12px 12px" }}>
              <SectionEditorBody section={section} onChange={(patch) => updateSection(i, patch)} />
            </div>
          )}
        </div>
      ))}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" className="btn-ghost admin-btn-small" onClick={() => addSection("richtext")}>
          + Add rich text
        </button>
        <button type="button" className="btn-ghost admin-btn-small" onClick={() => addSection("content-grid")}>
          + Add content grid
        </button>
      </div>
    </div>
  );
}

function ChildForm({ groupPath, initial, onSave, onUploadImage, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [shortName, setShortName] = useState(initial?.shortName || "");
  const [standardCode, setStandardCode] = useState(initial?.standardCode || "");
  const [note, setNote] = useState(initial?.note || "");
  const [sections, setSections] = useState(initial?.sections || []);
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(false);
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
        sections,
      };
      if (isEdit) {
        await onSave(payload);
      } else {
        const finalSlug = slugTouched && slug ? slugify(slug) : slugify(name);
        await onSave({ slug: finalSlug, path: `${groupPath}/${finalSlug}`, ...payload });
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
            placeholder="Optional internal label — not shown on cards"
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
      {!isEdit && (
        <div className="field">
          <label>URL slug</label>
          <input
            placeholder={name ? slugify(name) : "e.g. qms"}
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
          />
          <div className="mono" style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
            Keep this short — it's the link people see, e.g. {groupPath}/qms. Leave blank to
            auto-generate from the name. Can't be changed after saving.
          </div>
        </div>
      )}
      <div className="field">
        <label>Note</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <div className="field field-full">
        <SectionsEditor sections={sections} onChange={setSections} />
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
                  <th>Sections</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {group.children.map((child) => (
                  <tr key={child.slug}>
                    <td>{child.name}</td>
                    <td className="mono">{child.standardCode || "—"}</td>
                    <td>{child.sections?.length || 0}</td>
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
