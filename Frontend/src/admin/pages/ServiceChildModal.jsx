import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../components/Modal";
import BenefitsEditor from "../components/BenefitsEditor";
import { slugify } from "../../lib/store";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  path: z.string().min(1, "Path is required"),
  standardCode: z.string().optional(),
  note: z.string().optional(),
});

export default function ServiceChildModal({ group, child, existingSlugs, onSave, onClose }) {
  const isEdit = Boolean(child);
  const [benefits, setBenefits] = useState(child?.benefits || []);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: child?.name || "",
      slug: child?.slug || "",
      path: child?.path || "",
      standardCode: child?.standardCode || "",
      note: child?.note || "",
    },
  });

  const nameField = register("name");
  const onNameChange = (e) => {
    nameField.onChange(e);
    if (!isEdit) {
      const s = slugify(e.target.value);
      setValue("slug", s);
      setValue("path", s ? `${group.path}/${s}` : "");
    }
  };

  const onSubmit = (data) => {
    const slug = slugify(data.slug);
    if (!isEdit && existingSlugs.includes(slug)) {
      setFormError(`A sub-service with slug "${slug}" already exists in this group.`);
      return;
    }
    onSave({
      name: data.name.trim(),
      slug,
      path: data.path.trim(),
      standardCode: data.standardCode?.trim() || undefined,
      note: data.note?.trim() || undefined,
      benefits: benefits.filter((b) => b.label.trim()),
    });
    onClose();
  };

  return (
    <Modal title={isEdit ? `Edit ${child.name}` : `Add sub-service to ${group.name}`} onClose={onClose} wide>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {formError && <div className="error" style={{ marginBottom: 16 }}>{formError}</div>}

        <div className="form-grid">
          <div className="field">
            <label>Name<span className="req">*</span></label>
            <input {...nameField} onChange={onNameChange} />
            {errors.name && <div className="error">{errors.name.message}</div>}
          </div>
          <div className="field">
            <label>Standard code (optional)</label>
            <input className="mono" {...register("standardCode")} placeholder="e.g. ISO 14001:2015" />
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
            <input className="mono" {...register("path")} />
            {errors.path && <div className="error">{errors.path.message}</div>}
          </div>
        </div>

        <div className="field field-full">
          <label>Note (optional — shown to disambiguate similarly named items)</label>
          <input {...register("note")} placeholder="e.g. Certification standard — distinct from the services offering below." />
        </div>

        <BenefitsEditor values={benefits} onChange={setBenefits} />

        <div className="admin-modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isEdit ? "Save changes" : "Add sub-service"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
