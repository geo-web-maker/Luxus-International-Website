import { useState } from "react";

export default function TagListInput({ label, values, onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  };

  return (
    <div className="field field-full">
      {label && <label>{label}</label>}
      <div className="admin-taglist">
        {values.length === 0 && <span className="admin-taglist-empty">None yet</span>}
        {values.map((v) => (
          <span key={v} className="admin-tag">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} aria-label={`Remove ${v}`}>
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="admin-taglist-add">
        <input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className="btn-ghost admin-btn-small" onClick={add}>
          Add
        </button>
      </div>
    </div>
  );
}
