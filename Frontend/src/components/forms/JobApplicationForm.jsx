import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Field set and labels are a direct match to the extracted WP Job Manager
// _form_fields schema — do not rename without checking that source again.
const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^[0-9+\-\s]+$/, "Numbers only"),
  region: z.string().min(1, "Region is required"),
  message: z.string().min(1, "Message is required"),
  cv: z
    .any()
    .refine((files) => files?.length === 1, "CV upload is required"),
});

export default function JobApplicationForm({ jobTitle }) {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    // TODO: wire to FastAPI POST /api/job-applications (multipart, CV -> R2) once backend is live
    console.log("job application submit", { ...data, jobTitle });
    await new Promise((r) => setTimeout(r, 400));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="form-success">
        Thanks for applying{jobTitle ? ` for ${jobTitle}` : ""} — we've received your
        application and will be in touch.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field">
        <label>Full name<span className="req">*</span></label>
        <input {...register("fullName")} />
        {errors.fullName && <div className="error">{errors.fullName.message}</div>}
      </div>

      <div className="field">
        <label>Email address<span className="req">*</span></label>
        <input type="email" {...register("email")} />
        {errors.email && <div className="error">{errors.email.message}</div>}
      </div>

      <div className="field">
        <label>Phone number<span className="req">*</span></label>
        <input {...register("phone")} />
        {errors.phone && <div className="error">{errors.phone.message}</div>}
      </div>

      <div className="field">
        <label>Region<span className="req">*</span></label>
        <input placeholder="Type the region e.g Eastern" {...register("region")} />
        {errors.region && <div className="error">{errors.region.message}</div>}
      </div>

      <div className="field">
        <label>Message<span className="req">*</span></label>
        <textarea
          placeholder="Your cover letter/message sent to the employer"
          {...register("message")}
        />
        {errors.message && <div className="error">{errors.message.message}</div>}
      </div>

      <div className="field">
        <label>Upload CV<span className="req">*</span></label>
        <input type="file" {...register("cv")} />
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
          Max file size: cap this realistically (e.g. 10MB) — the original
          WP Job Manager default of 2GB is not worth carrying over.
        </div>
        {errors.cv && <div className="error">{errors.cv.message}</div>}
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit application"}
        </button>
      </div>
    </form>
  );
}
