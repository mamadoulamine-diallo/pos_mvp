import { Plus } from "lucide-react";
import { useState } from "react";

import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import ProductModal from "../components/ProductModal";
import ProductPreview from "../components/ProductPreview";
import ProductSearch from "../components/ProductSearch";
import useProducts from "../hooks/useProducts";
import AddStockForm from "../components/AddStockForm";
import ChangePriceForm from "../components/ChangePriceForm";

import "./ProductsPage.scss";

function ProductsPage() {
  const {
    products,
    search,
    setSearch,
    loading,
    error,
    createProduct,
    updateProduct,
    addStock,
    changePrice,
  } = useProducts();

  const [createOpen, setCreateOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);

  const [stockProduct, setStockProduct] = useState(null);

  const [priceProduct, setPriceProduct] = useState(null);

  async function handleCreateProduct(request) {
    await createProduct(request);

    setCreateOpen(false);
  }

  async function handleUpdateProduct(request) {
    if (!editingProduct) {
      return;
    }

    await updateProduct(editingProduct.id, request);

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

  function handleChangePrice(product) {
    setSelectedProduct(null);
    setPriceProduct(product);
  }

  async function handleSubmitStock(quantity) {
    if (!stockProduct) {
      return;
    }

    await addStock(stockProduct.id, quantity);

    setStockProduct(null);
  }

  async function handleSubmitPrice(salePrice, purchasePrice) {
    if (!priceProduct) return;

    await changePrice(priceProduct.id, salePrice, purchasePrice);

    setPriceProduct(null);
  }

  return (
    <main className="Products">
      <h1 className="Products-list-title">Produits</h1>

      <div className="Products-actions ProductAction">
        <ProductSearch value={search} onChange={setSearch} />

        <button
          className="Products-actions-addProductDesktop CTA"
          type="button"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={18} aria-hidden="true" />
          Ajouter un produit
        </button>
      </div>

      <hr />

      {loading && (
        <p className="Products-message">Chargement des produits...</p>
      )}

      {error && (
        <p className="Products-message Products-message--error">{error}</p>
      )}

      {!loading && !error && (
        <ProductList products={products} onSelect={setSelectedProduct} />
      )}

      {/* Création */}

      <ProductModal
        open={createOpen}
        title="Nouveau produit"
        onClose={() => setCreateOpen(false)}
      >
        <ProductForm
          key={createOpen ? "create-open" : "create-closed"}
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
            onCancel={() => setEditingProduct(null)}
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
            onCancel={() => setStockProduct(null)}
          />
        )}
      </ProductModal>

      <ProductModal
        open={Boolean(priceProduct)}
        title="Modifier le prix"
        onClose={() => setPriceProduct(null)}
      >
        {priceProduct && (
          <ChangePriceForm
            key={priceProduct.id}
            product={priceProduct}
            onSubmit={handleSubmitPrice}
            onCancel={() => setPriceProduct(null)}
          />
        )}
      </ProductModal>
    </main>
  );
}

export default ProductsPage;
