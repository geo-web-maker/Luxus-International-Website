import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { quoteFormOptions } from "../../data/siteContent";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Enter a valid email"),
  companySector: z.string().min(1, "Select a company sector"),
  typeOfService: z.string().min(1, "Select a type of service"),
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  numberOfEmployees: z.string().optional(),
  companyScope: z.string().optional(),
});

export default function QuoteForm({ presetService = "" }) {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { typeOfService: presetService },
  });

  const onSubmit = async (data) => {
    // TODO: wire to FastAPI POST /api/quote-requests once backend is live
    console.log("quote request submit", data);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="form-success">
        Thanks — your quotation request has been received. Our team will follow up shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-grid">
        <div className="field">
          <label>Customer's name — first<span className="req">*</span></label>
          <input {...register("firstName")} />
          {errors.firstName && <div className="error">{errors.firstName.message}</div>}
        </div>
        <div className="field">
          <label>Last</label>
          <input {...register("lastName")} />
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label>Phone number<span className="req">*</span></label>
          <input placeholder="+256 123 456 789" {...register("phone")} />
          {errors.phone && <div className="error">{errors.phone.message}</div>}
        </div>
        <div className="field">
          <label>Email<span className="req">*</span></label>
          <input type="email" {...register("email")} />
          {errors.email && <div className="error">{errors.email.message}</div>}
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label>Select company sector<span className="req">*</span></label>
          <select {...register("companySector")} defaultValue="">
            <option value="" disabled>Choose one</option>
            {quoteFormOptions.companySector.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.companySector && <div className="error">{errors.companySector.message}</div>}
        </div>
        <div className="field">
          <label>Type of service<span className="req">*</span></label>
          <select {...register("typeOfService")} defaultValue={presetService}>
            <option value="" disabled>Choose one</option>
            {quoteFormOptions.typeOfService.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.typeOfService && <div className="error">{errors.typeOfService.message}</div>}
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label>Company name<span className="req">*</span></label>
          <input {...register("companyName")} />
          {errors.companyName && <div className="error">{errors.companyName.message}</div>}
        </div>
        <div className="field">
          <label>Company website</label>
          <input {...register("companyWebsite")} />
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label>Country<span className="req">*</span></label>
          <input {...register("country")} />
          {errors.country && <div className="error">{errors.country.message}</div>}
        </div>
        <div className="field">
          <label>Number of employees</label>
          <input {...register("numberOfEmployees")} />
        </div>
      </div>

      <div className="field">
        <label>Company scope</label>
        <textarea {...register("companyScope")} placeholder="Briefly describe the scope of work or technical specifications..." />
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit request"}
        </button>
      </div>
    </form>
  );
}
