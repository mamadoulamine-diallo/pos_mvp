import { useState } from "react";

import CartFloatingButton from "../components/CartFloatingButton";
import SaleCart from "../components/SaleCart";
import SaleCategoryFilter from "../components/SaleCategoryFilter";
import SaleCheckout from "../components/SaleCheckout";
import SaleProductGrid from "../components/SaleProductGrid";
import SaleSearch from "../components/SaleSearch";
import SaleReceipt from "../components/SaleReceipt";

import useSaleCart from "../hooks/useSaleCart";
import useSaleProducts from "../hooks/useSaleProducts";

import { createSale } from "../services/saleService";

import "./NewSalePage.scss";

function NewSalePage() {
  const {
    products,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    refreshProducts,
  } = useSaleProducts();

  const {
    items,
    quantity,
    total,
    addProduct,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  } = useSaleCart();

  const [cartOpen, setCartOpen] = useState(false);

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [saleError, setSaleError] = useState(null);

  const [completedSale, setCompletedSale] = useState(null);

  function handleOpenCheckout() {
    if (items.length === 0) {
      return;
    }

    setSaleError(null);
    setCheckoutOpen(true);
  }

  function handleCloseCheckout() {
    if (submitting) {
      return;
    }

    setCheckoutOpen(false);
    setSaleError(null);
  }

  async function handleConfirmSale(paymentMethod) {
    if (items.length === 0 || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setSaleError(null);

      const savedSale = await createSale(items);

      const receiptSale = {
        id: savedSale.saleId,
        date: new Date(),

        items: items.map((item) => ({
          ...item,
        })),

        total,
        paymentMethod,
      };

      setCompletedSale(receiptSale);

      setCheckoutOpen(false);
      setCartOpen(false);

      clearCart();

      await refreshProducts();
    } catch (requestError) {
      console.error("Impossible d'enregistrer la vente.", requestError);

      setSaleError(
        requestError.message || "Impossible d'enregistrer la vente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleClearCart() {
    clearCart();
    setCartOpen(false);
    setSaleError(null);
  }

  return (
    <main className="NewSalePage">
      <section className="SaleProducts">
        <header className="SaleProducts-header">
          <h1>Nouvelle vente</h1>

          <SaleSearch value={search} onChange={setSearch} />
        </header>

        <SaleCategoryFilter
          value={selectedCategory}
          onChange={setSelectedCategory}
        />

        {loading && (
          <p className="SaleProducts-message">Chargement des produits...</p>
        )}

        {error && (
          <p className="SaleProducts-message SaleProducts-message--error">
            {error}
          </p>
        )}

        {!loading && !error && (
          <SaleProductGrid products={products} onAdd={addProduct} />
        )}
      </section>

      <CartFloatingButton
        quantity={quantity}
        onClick={() => setCartOpen((current) => !current)}
      />

      <SaleCart
        items={items}
        quantity={quantity}
        total={total}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeItem}
        onClear={handleClearCart}
        onValidate={handleOpenCheckout}
      />

      <SaleCheckout
        open={checkoutOpen}
        total={total}
        submitting={submitting}
        error={saleError}
        onClose={handleCloseCheckout}
        onConfirm={handleConfirmSale}
      />

      <SaleReceipt
        sale={completedSale}
        onClose={() => setCompletedSale(null)}
      />
    </main>
  );
}

export default NewSalePage;
