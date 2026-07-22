import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../components/Modal";
import { slugify } from "../../lib/store";

const jobTypes = ["Full Time", "Part Time", "Freelance", "Internship", "Temporary"];

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  id: z.string().min(1, "Slug is required"),
  location: z.string().min(1, "Location is required"),
  remote: z.boolean(),
  type: z.string().min(1),
  salary: z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  applicationDeadline: z.string().optional(),
  filled: z.boolean(),
  description: z.string().min(1, "Description is required"),
});

export default function JobModal({ job, existingIds, defaultCompanyName, onSave, onClose }) {
  const isEdit = Boolean(job);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: job?.title || "",
      id: job?.id || "",
      location: job?.location || "",
      remote: job?.remote || false,
      type: job?.type || jobTypes[0],
      salary: job?.salary || "",
      companyName: job?.companyName || defaultCompanyName,
      applicationDeadline: job?.applicationDeadline || "",
      filled: job?.filled || false,
      description: job?.description || "",
    },
  });

  const titleField = register("title");
  const onTitleChange = (e) => {
    titleField.onChange(e);
    if (!isEdit) setValue("id", slugify(e.target.value));
  };

  const onSubmit = (data) => {
    const id = slugify(data.id);
    if (!isEdit && existingIds.includes(id)) {
      setFormError(`A job with id "${id}" already exists.`);
      return;
    }
    onSave({ ...data, id, salary: data.salary?.trim() || null });
    onClose();
  };

  return (
    <Modal title={isEdit ? `Edit ${job.title}` : "Add job listing"} onClose={onClose} wide>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {formError && <div className="error" style={{ marginBottom: 16 }}>{formError}</div>}

        <div className="form-grid">
          <div className="field">
            <label>Job title<span className="req">*</span></label>
            <input {...titleField} onChange={onTitleChange} />
            {errors.title && <div className="error">{errors.title.message}</div>}
          </div>
          <div className="field">
            <label>Slug (used in the URL)<span className="req">*</span></label>
            <input className="mono" {...register("id")} disabled={isEdit} />
            {errors.id && <div className="error">{errors.id.message}</div>}
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Location<span className="req">*</span></label>
            <input {...register("location")} placeholder="Kampala, Uganda" />
            {errors.location && <div className="error">{errors.location.message}</div>}
          </div>
          <div className="field">
            <label>Type</label>
            <select {...register("type")}>
              {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Company name<span className="req">*</span></label>
            <input {...register("companyName")} />
            {errors.companyName && <div className="error">{errors.companyName.message}</div>}
          </div>
          <div className="field">
            <label>Salary (optional)</label>
            <input {...register("salary")} placeholder="Leave blank if undisclosed" />
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Application deadline</label>
            <input type="date" {...register("applicationDeadline")} />
          </div>
          <div className="field admin-checkbox-row">
            <label><input type="checkbox" {...register("remote")} /> Remote-friendly</label>
            <label><input type="checkbox" {...register("filled")} /> Position filled (hides from Career page)</label>
          </div>
        </div>

        <div className="field field-full">
          <label>Description<span className="req">*</span></label>
          <textarea {...register("description")} style={{ minHeight: 140 }} />
          {errors.description && <div className="error">{errors.description.message}</div>}
        </div>

        <div className="admin-modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isEdit ? "Save changes" : "Create listing"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
