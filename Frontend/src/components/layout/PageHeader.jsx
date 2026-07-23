export default function PageHeader({ eyebrow, title }) {
  return (
    <div className="pagehead">
      <div className="wrap">
        <div className="in">
          <span className="eyebrow mono">{eyebrow}</span>
          <h1>{title}</h1>
        </div>
      </div>
    </div>
  );
}
