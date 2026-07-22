import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import { company } from "../data/siteContent";

const aboutPanels = {
  values: {
    label: "Core values",
    path: "/about/core-values",
    render: () => (
      <ul>
        <li>Delivering exceptional service and support to every client</li>
        <li>Personalized solutions tailored to each organization's needs</li>
        <li>Fostering a culture of excellence and continuous improvement</li>
        <li>Building long-term relationships with clients and partners</li>
      </ul>
    ),
  },
  why: {
    label: "Why Luxuz",
    path: "/about/why-luxuz",
    render: () => (
      <p>
        Fully experienced, certified trainers with hands-on, interactive delivery.
        Quality training at the most affordable fees in the sector, without
        compromising standards.
      </p>
    ),
  },
  accred: {
    label: "Accreditation",
    path: "/about/accreditation",
    render: () => (
      <p>
        {company.shortName} operates in partnership with {company.accreditationPartner},
        ensuring every certification issued carries recognized international accreditation.
      </p>
    ),
  },
};

export default function About() {
  const [activeTab, setActiveTab] = useState("values");
  const ActivePanel = aboutPanels[activeTab];

  return (
    <>
      <PageHeader eyebrow="/about" title="Who we are" />

      <div className="about-copy">
        <p>
          {company.name} is dedicated to empowering organizations through expert ISO
          certification, training, consultancy, and engineering solutions. We partner
          with {company.accreditationPartner} to guide businesses toward compliance
          and operational excellence.
        </p>
        <p>
          Our team of engineers and certified consultants delivers tailored,
          transparent guidance from gap assessment through certification and ongoing
          surveillance audits.
        </p>
      </div>

      <div className="mv-grid">
        <div>
          <h3>Mission</h3>
          <p>
            To provide exceptional, reliable ISO certification and consultancy
            services that enable organizations to improve performance and achieve
            sustainable growth.
          </p>
        </div>
        <div>
          <h3>Vision</h3>
          <p>
            To be a global leader in affordable, effective ISO certification —
            empowering organizations to excel and drive positive impact.
          </p>
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
    </>
  );
}
