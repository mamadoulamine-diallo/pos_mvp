import {
  ArrowLeft,
  Boxes,
  Pencil,
  RefreshCw,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import ProductPriceHistory from "../components/ProductPriceHistory";

import {
  loadProduct,
  loadProductPriceHistory,
  loadProductPricing,
} from "../services/productService";

import "./ProductDetailsPage.scss";

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

function ProductDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  const [pricing, setPricing] =
    useState(null);

  const [priceHistory, setPriceHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    let cancelled = false;

    async function initializeProduct() {
      try {
        const [
          productData,
          pricingData,
          historyData,
        ] = await Promise.all([
          loadProduct(id),
          loadProductPricing(id),
          loadProductPriceHistory(id),
        ]);

        if (!cancelled) {
          setProduct(productData);
          setPricing(pricingData);
          setPriceHistory(historyData);
          setError(null);
        }
      } catch (requestError) {
        console.error(
          "Impossible de charger la fiche produit.",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Impossible de charger la fiche produit.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="ProductDetailsPage">
        <p className="ProductDetailsPage-message">
          Chargement du produit...
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="ProductDetailsPage">
        <p className="ProductDetailsPage-message ProductDetailsPage-message--error">
          {error ||
            "Produit introuvable."}
        </p>
      </main>
    );
  }

  return (
    <main className="ProductDetailsPage">
      <Link
        to="/products"
        className="ProductDetailsPage-back"
      >
        <ArrowLeft
          size={18}
          aria-hidden="true"
        />

        Retour aux produits
      </Link>

      <section className="ProductDetails">
        <div className="ProductDetails-media">
          <img
            src={getProductImage(
              product.imageUrl,
            )}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.onerror =
                null;

              event.currentTarget.src =
                `${imageBaseUrl}/default-product.webp`;
            }}
          />
        </div>

        <div className="ProductDetails-content">
          <header className="ProductDetails-header">
            <div>
              <span className="ProductDetails-category">
                {product.categoryName}
              </span>

              <h1>{product.name}</h1>
            </div>

            <span
              className={
                product.active
                  ? "ProductDetails-status ProductDetails-status--active"
                  : "ProductDetails-status ProductDetails-status--inactive"
              }
            >
              {product.active
                ? "Actif"
                : "Inactif"}
            </span>
          </header>

          <div className="ProductDetails-stats">
            <div>
              <span>Stock</span>

              <strong>
                {product.stockQuantity}
              </strong>
            </div>

            <div>
              <span>
                Prix de vente
              </span>

              <strong>
                {formatPrice(
                  pricing?.salePrice,
                )}
              </strong>
            </div>

            <div>
              <span>
                Prix d'achat
              </span>

              <strong>
                {formatPrice(
                  pricing?.purchasePrice,
                )}
              </strong>
            </div>
          </div>

          <div className="ProductDetails-actions">
            <button type="button">
              <Boxes size={18} />
              Ajouter du stock
            </button>

            <button type="button">
              <Pencil size={18} />
              Modifier
            </button>

            <button type="button">
              <RefreshCw size={18} />
              Modifier le prix
            </button>
          </div>
        </div>
      </section>

      <ProductPriceHistory
        prices={priceHistory}
      />
    </main>
  );
}

export default ProductDetailsPage;