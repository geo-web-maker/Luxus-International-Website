import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import ContactForm from "../components/forms/ContactForm";
import QuoteForm from "../components/forms/QuoteForm";
import { company } from "../data/siteContent";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const isQuote = searchParams.get("intent") === "quote";
  const presetService = searchParams.get("service") || "";

  if (isQuote) {
    return (
      <>
        <PageHeader eyebrow="/quote" title="Request a quotation" />
        <div className="section">
          <div className="wrap">
            <div className="quote-form-container">
              <QuoteForm presetService={presetService} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="/contact" title="Get in touch" />
      <div className="section">
        <div className="wrap">
          <div className="contact-main-grid">
          <div className="contact-info">
            <div className="row">
              <div className="label">Email</div>
              <div className="value mono">{company.email}</div>
            </div>
            <div className="row">
              <div className="label">Phone — 24/7 Support</div>
              <div className="value mono">{company.phone}</div>
            </div>
            <div className="row">
              <div className="label">Accreditation partner</div>
              <div className="value mono">{company.accreditationPartner}</div>
            </div>
            <div className="row" style={{ borderBottom: "none" }}>
              <div className="label">Headquarters</div>
              <div className="value">Kampala, Uganda</div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <ContactForm />
          </div>
        </div>

        <div className="contact-map-full">
          <div className="map-placeholder">
            <span className="mono">[ Interactive Map — Kampala Headquarters ]</span>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
