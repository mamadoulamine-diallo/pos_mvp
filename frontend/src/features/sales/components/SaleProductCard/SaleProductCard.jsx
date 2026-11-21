import { ShoppingCart } from "lucide-react";

import "./SaleProductCard.scss";

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

function SaleProductCard({
  product,
  onAdd,
}) {
  const outOfStock =
    product.stockQuantity <= 0;

  const lowStock =
    product.stockQuantity > 0 &&
    product.stockQuantity <= 5;

  function handleAddProduct() {
    if (!outOfStock) {
      onAdd(product);
    }
  }

  return (
    <article
      className={
        outOfStock
          ? "SaleProductCard SaleProductCard--disabled"
          : "SaleProductCard"
      }
      onClick={handleAddProduct}
    >
      <div className="SaleProductCard-media">
        <img
          src={getProductImage(product.imageUrl)}
          alt={product.name}
          className="SaleProductCard-image"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              `${imageBaseUrl}/default-product.webp`;
          }}
        />

        <strong className="SaleProductCard-name">
          {product.name}
        </strong>
      </div>

      <span
        className={[
          "SaleProductCard-stock",
          outOfStock &&
            "SaleProductCard-stock--out",
          lowStock &&
            "SaleProductCard-stock--low",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        Stock : {product.stockQuantity}
      </span>

      <footer className="SaleProductCard-footer">
        <strong>
          {formatPrice(product.salePrice)}
        </strong>

        <button
          type="button"
          disabled={outOfStock}
          aria-label={`Ajouter ${product.name} au panier`}
          onClick={(event) => {
            event.stopPropagation();

            handleAddProduct();
          }}
        >
          <ShoppingCart
            size={18}
            aria-hidden="true"
          />
        </button>
      </footer>
    </article>
  );
}

export default SaleProductCard;