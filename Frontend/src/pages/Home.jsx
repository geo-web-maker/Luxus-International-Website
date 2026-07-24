import ServiceCard from "../components/ui/ServiceCard";
import HeroRotator from "../components/HeroRotator/HeroRotator";
import TypewriterText from "../components/TypewriterText/TypewriterText";
import HeroParticles from "../components/HeroParticles/HeroParticles";
import { services } from "../data/services";
import { Link } from "react-router-dom";
import { company, isoCoverageTags, quoteFormOptions } from "../data/siteContent";

// Typed/rotated in the hero tagline — real content only: the client's own
// tagline, the previously-approved headline copy, and real service lines
// from the quote-form options (not invented marketing copy).
const heroTypewriterPhrases = [
  company.tagline,
  "Built for the standards that build trust.",
  ...quoteFormOptions.typeOfService.slice(0, 4),
];

export default function Home() {
  const teaserServices = services.slice(0, 3);

  return (
    <>
      {/* Hero — structure mirrors the original localhost site 1:1:
          live animated background, rotating greeting + company name as the
          headline, a typed/looping tagline underneath, then the CTA. */}
      <div className="hero">
        <HeroParticles />
        <div className="wrap">
          <div className="hero-inner">
            <h1 className="hero-heading">
              <span className="hero-greeting">
                <HeroRotator words={["Karibu kwa", "Welcome to"]} interval={2200} />
              </span>
              <span className="hero-heading-name">{company.name}</span>
            </h1>

            <p className="hero-typewriter-line">
              <TypewriterText phrases={heroTypewriterPhrases} />
            </p>

            <p className="hero-sub">
              {company.shortName} partners with {company.accreditationPartner} to deliver
              ISO certification, engineering design, and HSE compliance — hassle-free,
              from audit to accreditation.
            </p>

            <div className="hero-actions">
              <Link to="/contact?intent=quote" className="btn-primary">Get a quotation</Link>
              <Link to="/services" className="btn-ghost">Our services</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ISO coverage tags — kept, just moved out of the hero itself so the
          hero can match the original structure exactly; still the first
          thing under the fold. */}
      <div className="hero-coverage-strip">
        <div className="wrap hero-coverage mono">
          {isoCoverageTags.map((tag) => <span key={tag}>{tag}</span>)}
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
