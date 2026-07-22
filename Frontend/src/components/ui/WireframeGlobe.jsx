// The logo-derived wireframe globe used in place of hero/header photography
// (see design brief — "no hero image" was solved with this, not stock photos).
export default function WireframeGlobe({ size, opacity = 0.16, className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      width={size || "clamp(360px, 55vw, 760px)"}
      height={size || "clamp(360px, 55vw, 760px)"}
      style={{ opacity, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="180" fill="none" stroke="var(--brand-blue)" strokeWidth="1.5" />
      <ellipse cx="200" cy="200" rx="60" ry="180" fill="none" stroke="var(--brand-blue)" strokeWidth="1.5" />
      <ellipse cx="200" cy="200" rx="120" ry="180" fill="none" stroke="var(--brand-blue)" strokeWidth="1.5" />
      <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="var(--brand-blue)" strokeWidth="1.5" />
      <ellipse cx="200" cy="200" rx="180" ry="120" fill="none" stroke="var(--brand-blue)" strokeWidth="1.5" />
      <line x1="20" y1="200" x2="380" y2="200" stroke="var(--brand-blue)" strokeWidth="1.5" />
      <line x1="200" y1="20" x2="200" y2="380" stroke="var(--brand-blue)" strokeWidth="1.5" />
    </svg>
  );
}
