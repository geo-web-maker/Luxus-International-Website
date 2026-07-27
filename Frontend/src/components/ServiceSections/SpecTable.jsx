export default function SpecTable({ rows }) {
  return (
    <div className="spec-table">
      {rows.map((row) => (
        <div className="spec-row" key={row.label}>
          <div className="spec-label">{row.label}</div>
          <div className="spec-sep">:</div>
          <div className="spec-value">{row.value}</div>
        </div>
      ))}
    </div>
  );
}
