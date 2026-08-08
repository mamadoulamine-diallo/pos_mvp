import { ShoppingCart } from "lucide-react";

import "./ProductCard.scss";

function getProductImage(imageUrl) {
  const imageBaseUrl =
    import.meta.env.VITE_PRODUCT_IMAGE_BASE_URL;

  if (!imageUrl) {
    return `${imageBaseUrl}/default-product.webp`;
  }

  return `${imageBaseUrl}/${imageUrl}`;
}

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString("fr-FR")} F`;
}

function ProductCard({ product }) {
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

  return (
    <article className="Products-list-item ProductCard">
      <div className="ProductCard-media">
        <img
          src={getProductImage(product.imageUrl)}
          className="ProductCard-media-img"
          alt={product.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = getProductImage(null);
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
        >
          <ShoppingCart
            size={18}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}

export default ProductCard;