import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../components/Modal";
import TagListInput from "../components/TagListInput";
import { useState } from "react";
import { slugify } from "../../lib/store";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  path: z.string().min(1, "Path is required"),
  shortName: z.string().optional(),
  summary: z.string().optional(),
  imageStatus: z.enum(["pending", "confirmed"]),
  imageNote: z.string().optional(),
});

export default function ServiceGroupModal({ group, existingSlugs, onSave, onClose }) {
  const isEdit = Boolean(group);
  const [includedServices, setIncludedServices] = useState(group?.includedServices || []);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: group?.name || "",
      slug: group?.slug || "",
      path: group?.path || "",
      shortName: group?.shortName || "",
      summary: group?.summary || "",
      imageStatus: group?.image?.status || "pending",
      imageNote: group?.image?.note || "",
    },
  });

  const nameField = register("name");

  // Auto-suggest slug/path from the name while creating, unless the person has
  // already typed their own slug.
  const onNameChange = (e) => {
    nameField.onChange(e);
    if (!isEdit) {
      const s = slugify(e.target.value);
      setValue("slug", s);
      setValue("path", s ? `/ser/${s}` : "");
    }
  };

  const [formError, setFormError] = useState("");

  const onSubmit = (data) => {
    const slug = slugify(data.slug);
    if (!isEdit && existingSlugs.includes(slug)) {
      setFormError(`A service group with slug "${slug}" already exists.`);
      return;
    }
    onSave({
      name: data.name.trim(),
      slug,
      path: data.path.trim(),
      shortName: data.shortName?.trim() || data.name.trim(),
      summary: data.summary?.trim() || "",
      image: { status: data.imageStatus, ...(data.imageNote?.trim() ? { note: data.imageNote.trim() } : {}) },
      includedServices,
    });
    onClose();
  };

  return (
    <Modal title={isEdit ? `Edit ${group.name}` : "Add service group"} onClose={onClose} wide>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {formError && <div className="error" style={{ marginBottom: 16 }}>{formError}</div>}

        <div className="form-grid">
          <div className="field">
            <label>Group name<span className="req">*</span></label>
            <input {...nameField} onChange={onNameChange} />
            {errors.name && <div className="error">{errors.name.message}</div>}
          </div>
          <div className="field">
            <label>Short name (used on cards)</label>
            <input {...register("shortName")} placeholder="Defaults to group name" />
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Slug<span className="req">*</span></label>
            <input className="mono" {...register("slug")} disabled={isEdit} />
            {isEdit && <div className="admin-field-hint">Slug can't be changed after creation.</div>}
            {errors.slug && <div className="error">{errors.slug.message}</div>}
          </div>
          <div className="field">
            <label>Route path<span className="req">*</span></label>
            <input className="mono" {...register("path")} placeholder="/ser/example" />
            {errors.path && <div className="error">{errors.path.message}</div>}
          </div>
        </div>

        <div className="field field-full">
          <label>Summary</label>
          <textarea {...register("summary")} placeholder="One or two sentences shown on the group's listing page." />
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Image status</label>
            <select {...register("imageStatus")} defaultValue={group?.image?.status || "pending"}>
              <option value="pending">Pending — show "image pending" tag</option>
              <option value="confirmed">Confirmed — real asset available</option>
            </select>
          </div>
          <div className="field">
            <label>Image note (optional)</label>
            <input {...register("imageNote")} placeholder="e.g. see icon_inventory.csv" />
          </div>
        </div>

        <TagListInput
          label="Included services (optional — for groups without sub-services, e.g. Surveying Works)"
          values={includedServices}
          onChange={setIncludedServices}
          placeholder="e.g. Fresh Survey"
        />

        <div className="admin-modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isEdit ? "Save changes" : "Create group"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
