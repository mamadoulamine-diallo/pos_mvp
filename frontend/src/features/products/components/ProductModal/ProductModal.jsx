import { X } from "lucide-react";
import { useEffect } from "react";

import "./ProductModal.scss";

function ProductModal({
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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={
        open
          ? "ProductModal open"
          : "ProductModal"
      }
      aria-hidden={!open}
    >
      <button
        type="button"
        className="ProductModal-backdrop"
        aria-label="Fermer"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />

      <section
        className="ProductModal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <header className="ProductModal-header">
          <h2
            id="product-modal-title"
            className="ProductModal-title"
          >
            {title}
          </h2>

          <button
            type="button"
            className="ProductModal-close"
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

export default ProductModal;