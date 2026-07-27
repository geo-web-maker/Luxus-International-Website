import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import { useContent } from "../hooks/useContent";

export default function About() {
  const [activeTab, setActiveTab] = useState("values");
  const { data: content, loading, error } = useContent();

  if (loading) {
    return (
      <>
        <PageHeader eyebrow="/about" title="Who we are" />
        <div className="wrap"><div className="section">Loading…</div></div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader eyebrow="/about" title="Who we are" />
        <div className="wrap"><div className="section">Couldn't load content: {error.message}</div></div>
      </>
    );
  }

  const company = content.company;

  // aboutPanels stays defined inside the component body now, since the
  // accreditation panel's copy depends on `company`, which is only
  // available once useContent() resolves.
  const aboutPanels = {
    values: {
      label: "Core values",
      path: "/about/core-values",
      render: () => (
        <>
          <p>
            At {company.shortName}, our values reflect our culture, what we promise our
            customers, and our dedication to our purpose of ensuring access to ISO
            Certification, providing innovative survey and engineering design solutions.
            We take pride in embracing our values as part of our DNA which designate and
            guide the way we work with our esteemed clients, business partners, and other
            stakeholders. Like a compass, our values influence our choices, our direction,
            and our actions, giving everyone the same and unique mission by empowering us
            all to do much more effectively together.
          </p>
          <p>
            Through excellence, curiosity, integrity, team work, and passion to our craft,
            we are recognized as a trusted partner, a thought leader, and a driver of
            positive change in the ever-evolving industries that we serve.
          </p>
          <div className="values-grid">
            <div className="value-card">
              <h4>Curiosity</h4>
              <p>
                We go above and beyond as we constantly push the boundaries to shape our
                future and the future of our clients. We always challenge the status quo
                as we are keen to explore unmet customer needs and solutions to emerging
                engineering problems. We constantly aim to find reliable, effective, and
                more sustainable solutions to meet customer needs and achieve our purpose.
              </p>
            </div>
            <div className="value-card">
              <h4>Integrity</h4>
              <p>
                We believe in staying true to what we know is right. In every decision we
                make, we strive for what is right and what serves the good of others within
                our company and across our industry. We act with openness, honesty,
                transparency, and in line with relevant statutory legislation always.
              </p>
            </div>
            <div className="value-card">
              <h4>Team Work</h4>
              <p>
                We believe in trusting each other and earning the trust of others, as our
                unwavering belief in each other gives us the confidence to excel. We feel
                supported and empowered to develop our capabilities so we can do greater
                things together.
              </p>
            </div>
            <div className="value-card">
              <h4>Passion to our Craft</h4>
              <p>
                We are always internally driven to deliver the exceptional. We love and
                find honour in what we do, as we are always passionate about our purpose
                of ensuring easy access to ISO Certification, providing innovative survey
                and engineering design solutions. This constantly inspires us to always
                raise the bar on our performance and innovation. We channel our passion to
                create and build a more sustainable business world, together with our
                customers and our partners.
              </p>
            </div>
            <div className="value-card">
              <h4>Excellence</h4>
              <p>
                Our clients are at the heart of all our business operations and processes.
                We take pride in our enormous efforts directed towards understanding the
                unique needs and challenges of our clients and promptly offering
                personalized solutions that meet their unique needs. Customers drive every
                decision that we make as a business, as we work dynamically not only to
                attract new clients but also to earn and retain the loyalty of our
                existing clients.
              </p>
            </div>
          </div>
        </>
      ),
    },
    why: {
      label: "Why Luxuz",
      path: "/about/why-luxuz",
      render: () => (
        <ul className="why-grid">
          <li>
            <h4>Internationally Accredited Certification</h4>
          </li>
          <li>
            <h4>Independent Management System Auditing</h4>
          </li>
          <li>
            <h4>Long Standing Relationships</h4>
          </li>
          <li>
            <h4>Customized Customer's Tailored Services</h4>
          </li>
          <li>
            <h4>Personalized Training and Consultancy Services</h4>
          </li>
          <li>
            <h4>Accurate Survey Work &amp; Innovative Engineering Design</h4>
          </li>
          <li>
            <h4>Reliable Exceptional Service Provision</h4>
          </li>
        </ul>
      ),
    },
    accred: {
      label: "Accreditation",
      path: "/about/accreditation",
      render: () => (
        <p>
          {company.shortName} works in association with MQA Certification UK Ltd, which
          is accredited by the International Accreditation Service/Body for performing
          third party audits for different types of organizations in the world and
          issuing certificates of registration as per ISO/IEC 17000:2020.
          {" "}{company.shortName} in association with MQA International Certification
          Body understands the value of the accreditation process, and that's why it is
          company policy to achieve various accreditations for all related services
          wherever possible.
        </p>
      ),
    },
  };

  const ActivePanel = aboutPanels[activeTab];

  return (
    <>
      <PageHeader eyebrow="/about" title="Who we are" />
      <div className = "wrap">
        <div className="about-copy">
          <p>
            {company.name} is dedicated to empowering organizations through expert ISO
            certification, training, consultancy, and engineering solutions. We partner
            with {company.accreditationPartner} to guide businesses toward compliance
            and operational excellence.
          </p>
          <p>
            Our experienced and highly skilled expert trainers and consultants provide
            customized training and consultancy services that meet the unique needs of
            each client, as we work closely with them for a transparent and successful
            implementation and certification process.
          </p>
          <p>
            Our team of experienced engineers provides innovative, creative but practical
            engineering design solutions for various industries. We offer precise and
            accurate surveying services to support infrastructure development,
            construction, and all engineering projects, in addition to supply of quality
            and standard safety equipment.
          </p>
          <p>
            As a customer-centric firm, we understand that each industry has its unique
            requirements, and our highly skilled and experienced experts tailor solutions
            in accordance with customer-specific needs, thus ensuring maximum effectiveness
            and efficiency. We prioritize total customer satisfaction as our team of
            experts work closely with clients in order to understand their vision, goals,
            and business targets as well as their challenges. We offer personalized
            guidance and support throughout the implementation and certification roadmap.
            Our services are characterized by simplicity and affordability.
          </p>
        </div>

        <div className="mv-grid">
          <div>
            <h3>Mission</h3>
            <p>
              To provide exceptional and reliable ISO certification and consultancy
              services, survey and engineering design solutions that enable organizations
              to improve their operational performance, enhance their reputation, and
              achieve sustainable growth.
            </p>
            <p><em>We are committed to:</em></p>
            <ul>
              <li>Delivering exceptional service and support to our clients</li>
              <li>Providing personalized solutions that meet the unique needs of each organization</li>
              <li>Fostering a culture of excellence, innovation, and continuous improvement</li>
              <li>Building long-term relationships with our clients, partners and stakeholders</li>
              <li>Contributing to the growth and development of the communities we serve</li>
            </ul>
          </div>
          <div>
            <h3>Vision</h3>
            <p>
              To be a global leader in providing effective but affordable ISO
              certification and consultancy services, innovative survey and engineering
              design solutions that empower organizations to achieve excellence, enhanced
              operational performance, and drive a positive impact on society.
            </p>
            <p><em>We envision a future where:</em></p>
            <ul>
              <li>Organizations/companies of all sizes and industries can easily access and benefit from our innovative and expertise services</li>
              <li>Our solutions enable businesses to improve their efficiency, productivity, and competitiveness</li>
              <li>Our services contribute to the creation of safer, healthier, and more sustainable work environments</li>
              <li>Our company is recognized as a trusted partner, a thought leader, and a driver of positive change in the industries we serve</li>
            </ul>
          </div>
        </div>

        {/* Dynamic tab-swap panel — client-side state only, never navigates */}
        <div className="about-links mono">
          {Object.entries(aboutPanels).map(([key, panel]) => (
            <button
              key={key}
              className={activeTab === key ? "on" : ""}
              onClick={() => setActiveTab(key)}
              aria-pressed={activeTab === key}
            >
              <span className="id">{panel.path}</span>
              <span className="t">{panel.label}</span>
            </button>
          ))}
        </div>
        <div className="about-panel">{ActivePanel.render()}</div>
      </div>
    </>
  );
}
