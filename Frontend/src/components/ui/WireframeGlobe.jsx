export default function WireframeGlobe({ opacity = 0.16, className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
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