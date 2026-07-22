import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import ContactForm from "../components/forms/ContactForm";
import QuoteForm from "../components/forms/QuoteForm";
import { company } from "../data/siteContent";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const isQuote = searchParams.get("intent") === "quote";
  const presetService = searchParams.get("service") || "";

  return (
    <>
      
    <PageHeader eyebrow="/contact" title={isQuote ? "Request a quotation" : "Get in touch"} />
      <div className = "wrap">
        <div className="contact-grid">
          <div className="contact-info">
            <div className="row">
              <div className="label">Email</div>
              <div className="value mono">{company.email}</div>
            </div>
            <div className="row">
              <div className="label">Phone — 24/7</div>
              <div className="value mono">{company.phone}</div>
            </div>
            <div className="row" style={{ borderBottom: "none" }}>
              <div className="label">Accreditation partner</div>
              <div className="value mono">{company.accreditationPartner}</div>
            </div>
          </div>
          <div className="contact-map">
            <span className="mono">[ map embed ]</span>
          </div>
        </div>

        <div className="section" style={{ maxWidth: 640 }}>
          {isQuote ? <QuoteForm presetService={presetService} /> : <ContactForm />}
        </div>
      </div>
    </>
  );
}
