import ServiceCard from "../components/ui/ServiceCard";
import HeroRotator from "../components/HeroRotator/HeroRotator";
import HeroParticles from "../components/HeroParticles/HeroParticles";
import { services } from "../data/services";
import { Link } from "react-router-dom";
import { company, isoCoverageTags, quoteFormOptions } from "../data/siteContent";

// Real service lines pulled from the actual quote-form options, plus the
// client's own tagline — same principle as the rest of the brief: content
// here reflects real data (typeOfService), not invented copy.
const heroRotatingLines = [
  company.tagline,
  ...quoteFormOptions.typeOfService.slice(0, 4),
];

export default function Home() {
  const teaserServices = services.slice(0, 3);

  return (
    <>
      <div className="hero">
        <HeroParticles />
        <div className="wrap">
          <div className="hero-inner">
            <span className="hero-greeting">
              <HeroRotator words={["Karibu kwa", "Welcome to"]} interval={2200} />
            </span>
            <span className="eyebrow">Certification · engineering · compliance</span>
            <h1>Built for the standards that build trust.</h1>
            <p>
              {company.shortName} partners with {company.accreditationPartner} to deliver
              ISO certification, engineering design, and HSE compliance — hassle-free,
              from audit to accreditation.
            </p>
            <p className="hero-rotating-line">
              <HeroRotator words={heroRotatingLines} interval={2800} />
            </p>
            <div className="hero-actions">
              <Link to="/contact?intent=quote" className="btn-primary">Get a quotation</Link>
              <Link to="/services" className="btn-ghost">Our services</Link>
            </div>
            <div className="hero-coverage mono">
               {isoCoverageTags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="wrap">
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
      </div>

      <div className="info-strip">
        <div className="wrap">
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
      </div>
    </>
  );
}
