import { Plus } from "lucide-react";

import ProductList from "../components/ProductList";
import ProductSearch from "../components/ProductSearch";
import useProducts from "../hooks/useProducts";

import "./ProductsPage.scss";

function ProductsPage() {
  const {
    products,
    search,
    setSearch,
    loading,
    error,
  } = useProducts();

  return (
    <main className="Products">
      <h1 className="Products-list-title">
        Produits
      </h1>

      <div className="Products-actions ProductAction">
        <ProductSearch
          value={search}
          onChange={setSearch}
        />

        <button
          className="Products-actions-addProductDesktop CTA"
          type="button"
        >
          <Plus size={18} aria-hidden="true" />
          Ajouter un produit
        </button>
      </div>

      <hr />

      {loading && (
        <p className="Products-message">
          Chargement des produits...
        </p>
      )}

      {error && (
        <p className="Products-message Products-message--error">
          {error}
        </p>
      )}

      {!loading && !error && (
        <ProductList products={products} />
      )}
    </main>
  );
}

export default ProductsPage;