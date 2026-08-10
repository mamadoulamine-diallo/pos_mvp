import { ShoppingCart } from "lucide-react";

import "./ProductCard.scss";

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

function ProductCard({
  product,
  onSelect,
}) {
  const isOutOfStock = product.stockQuantity === 0;

  const isLowStock =
    product.stockQuantity > 0 &&
    product.stockQuantity <= 5;

  const stockClass = [
    "ProductCard-stock",
    isOutOfStock && "ProductCard-stock--out",
    isLowStock && "ProductCard-stock--low",
  ]
    .filter(Boolean)
    .join(" ");

  function handleCardClick() {
    onSelect(product);
  }

  function handleCartClick(event) {
    event.stopPropagation();

    // Sera branché avec le module Caisse.
  }

  return (
    <article
      className="Products-list-item ProductCard"
      onClick={handleCardClick}
    >
      <div className="ProductCard-media">
        <img
          src={getProductImage(product.imageUrl)}
          className="ProductCard-media-img"
          alt={product.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              `${imageBaseUrl}/default-product.webp`;
          }}
        />

        <span className="ProductCard-media-name">
          {product.name}
        </span>
      </div>

      <div className={stockClass}>
        Stock : {product.stockQuantity}
      </div>

      <div className="ProductCard-footer">
        <span className="ProductCard-footer-price">
          {formatPrice(product.salePrice)}
        </span>

        <button
          type="button"
          className="ProductCard-footer-action"
          aria-label={`Ajouter ${product.name} à la vente`}
          onClick={handleCartClick}
        >
          <ShoppingCart size={18} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default ProductCard;