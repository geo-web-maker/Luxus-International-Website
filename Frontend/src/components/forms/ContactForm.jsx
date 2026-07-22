import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submissionsApi } from "../../lib/store";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(1, "Message is required"),
});

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    // TODO: wire to FastAPI POST /api/contact-messages once backend is live.
    // Until then, submissions land in the local admin inbox (Admin > Submissions).
    submissionsApi.create("contact", data);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="form-success">
        Thanks — your message has been sent. We'll get back to you shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-grid">
        <div className="field">
          <label>First name<span className="req">*</span></label>
          <input {...register("firstName")} />
          {errors.firstName && <div className="error">{errors.firstName.message}</div>}
        </div>
        <div className="field">
          <label>Last name</label>
          <input {...register("lastName")} />
        </div>
      </div>
      <div className="field">
        <label>Email<span className="req">*</span></label>
        <input type="email" {...register("email")} />
        {errors.email && <div className="error">{errors.email.message}</div>}
      </div>
      <div className="field">
        <label>Message<span className="req">*</span></label>
        <textarea {...register("message")} />
        {errors.message && <div className="error">{errors.message.message}</div>}
      </div>
      <div className="form-submit-row">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
