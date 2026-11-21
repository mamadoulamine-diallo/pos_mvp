import { Plus } from "lucide-react";
import { useState } from "react";

import AddStockForm from "../components/AddStockForm";
import ChangePriceForm from "../components/ChangePriceForm";
import ProductCategoryFilter from "../components/ProductCategoryFilter";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import ProductModal from "../components/ProductModal";
import ProductPreview from "../components/ProductPreview";
import ProductSearch from "../components/ProductSearch";
import ProductStatusFilter from "../components/ProductStatusFilter";

import useProducts from "../hooks/useProducts";
import { loadProductPricing } from "../services/productService";

import "./ProductsPage.scss";

function ProductsPage() {
  const {
    products,

    search,
    setSearch,

    selectedCategory,
    setSelectedCategory,

    selectedFilter,
    setSelectedFilter,

    loading,
    error,

    createProduct,
    updateProduct,
    addStock,
    changePrice,
  } = useProducts();

  // Modales

  const [createOpen, setCreateOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [stockProduct, setStockProduct] =
    useState(null);

  const [priceProduct, setPriceProduct] =
    useState(null);

  // Pricing

  const [pricing, setPricing] = useState(null);

  const [pricingLoading, setPricingLoading] =
    useState(false);

  async function handleCreateProduct(request) {
    await createProduct(request);

    setCreateOpen(false);
  }

  async function handleUpdateProduct(request) {
    if (!editingProduct) {
      return;
    }

    await updateProduct(
      editingProduct.id,
      request,
    );

    setEditingProduct(null);
  }

  function handleEditProduct(product) {
    setSelectedProduct(null);
    setEditingProduct(product);
  }

  function handleAddStock(product) {
    setSelectedProduct(null);
    setStockProduct(product);
  }

  async function handleChangePrice(product) {
    try {
      setSelectedProduct(null);
      setPricingLoading(true);

      const currentPricing =
        await loadProductPricing(product.id);

      setPriceProduct(product);
      setPricing(currentPricing);
    } catch (requestError) {
      console.error(
        "Impossible de charger les prix du produit.",
        requestError,
      );
    } finally {
      setPricingLoading(false);
    }
  }

  async function handleSubmitStock(quantity) {
    if (!stockProduct) {
      return;
    }

    await addStock(
      stockProduct.id,
      quantity,
    );

    setStockProduct(null);
  }

  async function handleSubmitPrice(
    salePrice,
    purchasePrice,
  ) {
    if (!priceProduct) {
      return;
    }

    await changePrice(
      priceProduct.id,
      salePrice,
      purchasePrice,
    );

    setPriceProduct(null);
    setPricing(null);
  }

  function closePriceModal() {
    setPriceProduct(null);
    setPricing(null);
  }

  return (
    <main className="Products">
      {/* Header */}

      <div className="Products-header">
        <div className="Products-heading">
          <h1 className="Products-list-title">
            Produits
          </h1>

          <p className="Products-count">
            {products.length} produit
            {products.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="Products-header-search">
          <ProductSearch
            value={search}
            onChange={setSearch}
          />
        </div>

        <button
          className="Products-addButton CTA"
          type="button"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={18} aria-hidden="true" />
          Ajouter un produit
        </button>
      </div>

      <hr />

      {/* Filtres */}

      <div className="Products-filters">
        <ProductCategoryFilter
          value={selectedCategory}
          onChange={setSelectedCategory}
        />

        <ProductStatusFilter
          value={selectedFilter}
          onChange={setSelectedFilter}
        />
      </div>

      {/* États */}

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

      {!loading && !error && products.length === 0 && (
        <div className="Products-empty">
          <h2>Aucun produit trouvé</h2>

          <p>
            Essayez de modifier votre recherche
            ou vos filtres.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <ProductList
          products={products}
          onSelect={setSelectedProduct}
        />
      )}

      {/* Création */}

      <ProductModal
        open={createOpen}
        title="Nouveau produit"
        onClose={() => setCreateOpen(false)}
      >
        <ProductForm
          key={
            createOpen
              ? "create-open"
              : "create-closed"
          }
          mode="create"
          onSubmit={handleCreateProduct}
          onCancel={() => setCreateOpen(false)}
        />
      </ProductModal>

      {/* Preview */}

      <ProductPreview
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddStock={handleAddStock}
        onEdit={handleEditProduct}
        onChangePrice={handleChangePrice}
      />

      {/* Edition */}

      <ProductModal
        open={Boolean(editingProduct)}
        title="Modifier le produit"
        onClose={() => setEditingProduct(null)}
      >
        {editingProduct && (
          <ProductForm
            key={editingProduct.id}
            mode="edit"
            product={editingProduct}
            onSubmit={handleUpdateProduct}
            onCancel={() =>
              setEditingProduct(null)
            }
          />
        )}
      </ProductModal>

      {/* Ajout de stock */}

      <ProductModal
        open={Boolean(stockProduct)}
        title="Ajouter du stock"
        onClose={() => setStockProduct(null)}
      >
        {stockProduct && (
          <AddStockForm
            key={stockProduct.id}
            product={stockProduct}
            onSubmit={handleSubmitStock}
            onCancel={() =>
              setStockProduct(null)
            }
          />
        )}
      </ProductModal>

      {/* Modification du prix */}

      <ProductModal
        open={Boolean(priceProduct)}
        title="Modifier le prix"
        onClose={closePriceModal}
      >
        {pricingLoading && (
          <p className="Products-message">
            Chargement des prix...
          </p>
        )}

        {priceProduct &&
          pricing &&
          !pricingLoading && (
            <ChangePriceForm
              key={`${priceProduct.id}-${pricing.salePrice}-${pricing.purchasePrice}`}
              product={priceProduct}
              pricing={pricing}
              onSubmit={handleSubmitPrice}
              onCancel={closePriceModal}
            />
          )}
      </ProductModal>
    </main>
  );
}

export default ProductsPage;