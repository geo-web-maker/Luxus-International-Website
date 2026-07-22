import Modal from "./Modal";

export default function ConfirmDialog({ title, message, confirmLabel = "Delete", onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
        {message}
      </p>
      <div className="admin-modal-actions">
        <button type="button" className="btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="btn-primary admin-btn-danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
