import {
  Boxes,
  Pencil,
  RefreshCw,
  X,
} from "lucide-react";
import { useEffect } from "react";

import "./ProductPreview.scss";

const imageBaseUrl =
  import.meta.env.VITE_PRODUCT_IMAGE_BASE_URL;

function getProductImage(imageUrl) {
  if (!imageUrl) {
    return `${imageBaseUrl}/default-product.webp`;
  }

  return `${imageBaseUrl}/${imageUrl}`;
}

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString("fr-FR")} F`;
}

function ProductPreview({
  product,
  onClose,
  onAddStock,
  onEdit,
  onChangePrice,
}) {
  const open = Boolean(product);

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
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, onClose]);

  if (!product) {
    return null;
  }

  return (
    <div className="ProductPreview">
      <button
        type="button"
        className="ProductPreview-backdrop"
        aria-label="Fermer"
        onClick={onClose}
      />

      <section
        className="ProductPreview-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-preview-title"
      >
        <header className="ProductPreview-header">
          <div className="ProductPreview-heading">
            <img
              className="ProductPreview-image"
              src={getProductImage(product.imageUrl)}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  `${imageBaseUrl}/default-product.webp`;
              }}
            />

            <div>
              <h2 id="product-preview-title">
                {product.name}
              </h2>

              <span className="ProductPreview-category">
                {product.categoryName}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="ProductPreview-close"
            aria-label="Fermer"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="ProductPreview-content">
          <p>
            <strong>Stock</strong>
            <span>{product.stockQuantity}</span>
          </p>

          <p>
            <strong>Prix</strong>
            <span>
              {formatPrice(product.salePrice)}
            </span>
          </p>

          <p>
            <strong>Statut</strong>
            <span>
              {product.active ? "Actif" : "Inactif"}
            </span>
          </p>
        </div>

        <div className="ProductPreview-actions">
          <button
            type="button"
            onClick={() => onAddStock(product)}
          >
            <Boxes size={18} aria-hidden="true" />
            Ajouter du stock
          </button>

          <button
            type="button"
            onClick={() => onEdit(product)}
          >
            <Pencil size={18} aria-hidden="true" />
            Modifier
          </button>

          <button
            type="button"
            onClick={() => onChangePrice(product)}
          >
            <RefreshCw size={18} aria-hidden="true" />
            Modifier le prix
          </button>
        </div>
      </section>
    </div>
  );
}

export default ProductPreview;