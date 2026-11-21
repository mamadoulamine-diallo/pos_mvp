// UserModal.jsx
import { X } from "lucide-react";

import "./UserModal.scss";

function UserModal({
  open,
  title,
  children,
  onClose,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="UserModal">
      <button
        type="button"
        className="UserModal-backdrop"
        aria-label="Fermer"
        onClick={onClose}
      />

      <section
        className="UserModal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
      >
        <header className="UserModal-header">
          <h2 id="user-modal-title">
            {title}
          </h2>

          <button
            type="button"
            className="UserModal-close"
            aria-label="Fermer"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {children}
      </section>
    </div>
  );
}

export default UserModal;