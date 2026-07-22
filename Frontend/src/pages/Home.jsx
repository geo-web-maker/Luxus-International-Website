import WireframeGlobe from "../components/ui/WireframeGlobe";
import ServiceCard from "../components/ui/ServiceCard";
import { services } from "../data/services";
import { company, isoCoverageTags } from "../data/siteContent";

export default function Home() {
  const teaserServices = services.slice(0, 3);

  return (
    <>
      <div className="hero">
        <WireframeGlobe className="hero-globe" />
        <div className="hero-inner">
          <span className="eyebrow">Certification · engineering · compliance</span>
          <h1>Built for the standards that build trust.</h1>
          <p>
            {company.shortName} partners with {company.accreditationPartner} to deliver
            ISO certification, engineering design, and HSE compliance — hassle-free,
            from audit to accreditation.
          </p>
          <a href="/contact?intent=quote" className="btn-primary">Get a quotation</a>
          <a href="/services" className="btn-ghost">Our services</a>
          <div className="hero-coverage mono">
            {isoCoverageTags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Where we deliver</h2>
          <span className="count mono">{services.length} practice areas</span>
        </div>
        <div className="grid3">
          {teaserServices.map((s) => (
            <ServiceCard key={s.slug} path={s.path} name={s.shortName} image={s.image} />
          ))}
        </div>
      </div>

      <div className="info-strip">
        <div className="info-cell">
          <div className="label">Email</div>
          <div className="value mono">{company.email}</div>
        </div>
        <div className="info-cell">
          <div className="label">Phone</div>
          <div className="value mono">{company.phone}</div>
        </div>
        <div className="info-cell">
          <div className="label">Accreditation partner</div>
          <div className="value mono">{company.accreditationPartner}</div>
        </div>
      </div>
    </>
  );
}
