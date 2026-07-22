import WireframeGlobe from "../ui/WireframeGlobe";

export default function PageHeader({ eyebrow, title }) {
  return (
    <div className="pagehead">
      <WireframeGlobe opacity={0.14} className="hero-globe" />
      <div className="wrap">
        <div className="in">
          <span className="eyebrow mono">{eyebrow}</span>
          <h1>{title}</h1>
        </div>
      </div>
    </div>
  );
}
