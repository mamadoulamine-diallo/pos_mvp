import { X } from "lucide-react";
import { useEffect } from "react";

function CategoryModal({
  open,
  title,
  children,
  onClose,
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="CategoryModal">
      <button
        type="button"
        className="CategoryModal-backdrop"
        aria-label="Fermer"
        onClick={onClose}
      />

      <section
        className="CategoryModal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
      >
        <header className="CategoryModal-header">
          <h2 id="category-modal-title">
            {title}
          </h2>

          <button
            type="button"
            className="CategoryModal-close"
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

export default CategoryModal;