export default function BenefitsEditor({ values, onChange }) {
  const update = (i, patch) => onChange(values.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  const remove = (i) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { label: "", iconFile: "" }]);

  return (
    <div className="field field-full">
      <label>Certification benefits (optional — only leaf service pages use these)</label>
      {values.map((b, i) => (
        <div className="admin-benefit-row" key={i}>
          <span className="mono admin-benefit-id">{String(i + 1).padStart(2, "0")}</span>
          <input
            placeholder="Benefit label, e.g. Improved risk management"
            value={b.label}
            onChange={(e) => update(i, { label: e.target.value })}
          />
          <input
            placeholder="Icon file (optional)"
            value={b.iconFile || ""}
            onChange={(e) => update(i, { iconFile: e.target.value })}
          />
          <button
            type="button"
            className="admin-icon-btn"
            onClick={() => remove(i)}
            aria-label={`Remove benefit ${i + 1}`}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn-ghost admin-btn-small" onClick={add}>
        + Add benefit
      </button>
    </div>
  );
}
