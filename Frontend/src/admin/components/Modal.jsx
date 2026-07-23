import { useEffect } from "react";

export default function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="admin-modal-backdrop" onMouseDown={onClose}>
      <div
        className={`admin-modal ${wide ? "admin-modal-wide" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-head">
          <h3>{title}</h3>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}
