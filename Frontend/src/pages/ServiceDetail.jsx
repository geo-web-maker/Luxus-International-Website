import { useParams } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import ServiceCard from "../components/ui/ServiceCard";
import SectionRenderer from "../components/ServiceSections/SectionRenderer";
import { findServiceByPath } from "../lib/api";
import { useServices } from "../hooks/useServices";

export default function ServiceDetail() {
  const params = useParams();
  const splat = params["*"] || "";
  const fullPath = `/ser/${splat}`;
  const { data: services, loading, error } = useServices();

  if (loading) {
    return (
      <>
        <PageHeader eyebrow={fullPath} title="Loading…" />
        <div className="section"><div className="wrap">Loading…</div></div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader eyebrow={fullPath} title="Error" />
        <div className="section"><div className="wrap">Couldn't load services: {error.message}</div></div>
      </>
    );
  }

  const result = findServiceByPath(services, fullPath);

  if (!result) {
    return (
      <>
        <PageHeader eyebrow={fullPath} title="Not found" />
        <div className="section">
          <div className="wrap">
          <p style={{ color: "var(--text-secondary)" }}>
            No service matches <span className="mono">{fullPath}</span>.
          </p>
        </div>
      </div>
      </>
    );
  }

  const isCategory = Array.isArray(result.children) && result.children.length > 0;

  if (isCategory) {
    return (
      <>
        <PageHeader eyebrow={fullPath} title={result.name} />
        <div className="section">
            <div className="wrap">
            <p style={{ color: "var(--text-secondary)", maxWidth: 640, marginBottom: 32 }}>
              {result.summary}
            </p>
            <div className="grid3">
              {result.children.map((child) => (
                <ServiceCard
                  key={child.slug}
                  path={child.path}
                  name={child.standardCode ? `${child.standardCode} — ${child.name}` : child.name}
                  image={child.image}
                />
              ))}
            </div>
            <SectionRenderer sections={result.sections} />
          </div>
        </div>
      </>
    );
  }

  // Leaf page (a specific standard or sub-service)
  const parent = result.parent;
  const siblings = parent
    ? parent.children.filter((c) => c.slug !== result.slug)
    : [];

  return (
    <>
      <PageHeader
        eyebrow={fullPath}
        title={result.standardCode ? `${result.standardCode} ${result.name}` : result.name}
      />
      <div className = "wrap">
        <div className="detail-grid">
          <div className="detail-main">
            {result.image?.status === "confirmed" && result.image?.file ? (
              <img src={result.image.file} alt={result.name} className="detail-image" />
            ) : (
              <div className="detail-placeholder">
                <span>
                  ◻ pull real copy + confirmed image for "{result.slug}" from
                  pages_full_content.json / icon_inventory.csv
                </span>
              </div>
            )}
            <SectionRenderer sections={result.sections} />
            {(!result.sections || result.sections.length === 0) && (
              <p style={{ color: "var(--text-secondary)" }}>
                ◻ No content sections yet — add some for "{result.slug}" in the admin panel.
              </p>
            )}
          </div>

          {parent && (
            <div className="sidebar">
              <h3>More in {parent.name}</h3>
              <span className="sub mono">{parent.path}</span>
              <div className="sidebar-cards">
                {siblings.map((sib) => (
                  <ServiceCard
                    key={sib.slug}
                    path={sib.path}
                    name={sib.standardCode ? `${sib.standardCode} — ${sib.name}` : sib.name}
                    image={sib.image}
                  />
                ))}
              </div>
              <div className="sidebar-cta">
                <div className="t">Request a quote</div>
                <p>Get pricing for {result.name} tailored to your organization.</p>
                <a href={`/contact?intent=quote&service=${result.slug}`} className="btn-primary">
                  Get a quotation
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
