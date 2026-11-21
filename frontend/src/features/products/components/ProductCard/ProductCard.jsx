import { Eye } from "lucide-react";

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
  const outOfStock =
    product.stockQuantity <= 0;

  const lowStock =
    product.stockQuantity > 0 &&
    product.stockQuantity <= 5;

  function handleOpenProduct() {
    onSelect(product);
  }

  return (
    <article
      className="Products-list-item ProductCard"
      onClick={handleOpenProduct}
    >
      <div className="ProductCard-media">
        <img
          src={getProductImage(product.imageUrl)}
          alt={product.name}
          className="ProductCard-image"
          onError={(event) => {
            event.currentTarget.onerror = null;

            event.currentTarget.src =
              `${imageBaseUrl}/default-product.webp`;
          }}
        />

        <strong className="ProductCard-name">
          {product.name}
        </strong>
      </div>

      <span
        className={[
          "ProductCard-stock",
          outOfStock &&
            "ProductCard-stock--out",
          lowStock &&
            "ProductCard-stock--low",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        Stock : {product.stockQuantity}
      </span>

      <footer className="ProductCard-footer">
        <strong>
          {formatPrice(product.salePrice)}
        </strong>

        <button
          type="button"
          aria-label={`Voir ${product.name}`}
          onClick={(event) => {
            event.stopPropagation();
            handleOpenProduct();
          }}
        >
          <Eye
            size={18}
            aria-hidden="true"
          />
        </button>
      </footer>
    </article>
  );
}

export default ProductCard;