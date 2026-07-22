import { useParams, Link } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import ServiceCard from "../components/ui/ServiceCard";
import { findServiceByPath } from "../data/services";

export default function ServiceDetail() {
  const params = useParams();
  const splat = params["*"] || "";
  const fullPath = `/ser/${splat}`;
  const result = findServiceByPath(fullPath);

  if (!result) {
    return (
      <>
        <PageHeader eyebrow={fullPath} title="Not found" />
        <div className="section">
          <div className="wrap">
          <p style={{ color: "var(--text-secondary)" }}>
            No service matches <span className="mono">{fullPath}</span>. Check
            <span className="mono"> src/data/services.js</span> — this data is
            still a first-pass extraction, not the final content.
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
                  image={{ status: "pending" }}
                />
              ))}
            </div>
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
            <div className="detail-placeholder">
              <span>
                ◻ pull real copy + confirmed image for "{result.slug}" from
                pages_full_content.json / icon_inventory.csv
              </span>
            </div>
            <p>
              This is placeholder description text for {result.name}. Replace with the
              real body content extracted from the WordPress export for this page.
            </p>

            {result.benefits && (
              <>
                <h3>Certification benefits</h3>
                <div className="benefits">
                  {result.benefits.map((b) => (
                    <div className="benefit" key={b.id}>
                      <span className="id mono">{b.id}</span>
                      {b.label}
                      <span className="icon-tag mono">{b.iconFile}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {parent && (
            <div className="sidebar">
              <h3>More in {parent.name}</h3>
              <span className="sub mono">{parent.path}</span>
              {siblings.map((sib) => (
                <Link to={sib.path} className="sidebar-item" key={sib.slug}>
                  <span>
                    <span className="id mono">{sib.path}</span> {sib.name}
                  </span>
                </Link>
              ))}
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
