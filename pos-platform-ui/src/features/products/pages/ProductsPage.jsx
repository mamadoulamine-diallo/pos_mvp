import { Plus } from "lucide-react";
import { useState } from "react";

import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import ProductModal from "../components/ProductModal";
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
    createProduct,
  } = useProducts();

  const [createOpen, setCreateOpen] = useState(false);

  async function handleCreateProduct(request) {
    await createProduct(request);
    setCreateOpen(false);
  }

  function handleOpenCreateModal() {
    setCreateOpen(true);
  }

  function handleCloseCreateModal() {
    setCreateOpen(false);
  }

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
          onClick={handleOpenCreateModal}
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

      <ProductModal
        open={createOpen}
        title="Nouveau produit"
        onClose={handleCloseCreateModal}
      >
        <ProductForm
          key={createOpen ? "create-open" : "create-closed"}
          onSubmit={handleCreateProduct}
          onCancel={handleCloseCreateModal}
        />
      </ProductModal>
    </main>
  );
}

export default ProductsPage;