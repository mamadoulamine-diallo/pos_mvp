import { createCart } from "./components/cart.js";

document.addEventListener("DOMContentLoaded", () => {
  const saleProductCards = document.querySelectorAll(".SaleProducts .ProductCard");

  const cartPanel = document.querySelector(".CartPanel");
  const cartFloatingButton = document.querySelector(".CartFloatingButton");
  const cartItemsContainer = document.querySelector(".CartPanel-items");
  const cartCount = document.querySelector(".CartPanel-count");
  const cartFloatingCount = document.querySelector(".CartFloatingButton-count");
  const cartTotal = document.querySelector(".CartPanel-total strong");
  const validateButton = document.querySelector(".CartPanel-validate");
  const cancelCartButton = document.querySelector(".CartPanel-cancel");

  const checkoutOverlay = document.querySelector(".CheckoutOverlay");
  const checkoutTotalValue = document.querySelector(".Checkout-total-value");
  const checkoutMethods = document.querySelectorAll(".Checkout-method");
  const checkoutConfirm = document.querySelector(".Checkout-confirm");
  const checkoutCancel = document.querySelector(".Checkout-cancel");
  const checkoutClose = document.querySelector(".CheckoutOverlay .Overlay-close");
  const checkoutBackdrop = document.querySelector(".CheckoutOverlay .Overlay-backdrop");

  const receiptOverlay = document.querySelector(".ReceiptOverlay");
  const receiptItems = document.querySelector(".Receipt-items");
  const receiptTotalValue = document.querySelector(".Receipt-total-value");
  const receiptPaymentValue = document.querySelector(".Receipt-payment-value");
  const receiptNumber = document.querySelector(".Receipt-number");
  const receiptDate = document.querySelector(".Receipt-date");
  const receiptPrint = document.querySelector(".Receipt-print");
  const receiptNewSale = document.querySelector(".Receipt-newSale");
  const receiptClose = document.querySelector(".ReceiptOverlay .Overlay-close");
  const receiptBackdrop = document.querySelector(".ReceiptOverlay .Overlay-backdrop");

  const cart = createCart({
    onChange: renderCart,
    onToast: showToast,
  });

  function formatPrice(price) {
    return `${price.toLocaleString("fr-FR")} F`;
  }

  function showToast(message) {
    const toast = document.createElement("div");

    toast.className = "Toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  function getProductFromCard(card) {
    const name = card.querySelector(".ProductCard-media-name").textContent.trim();

    const priceText = card
      .querySelector(".ProductCard-footer-price")
      .textContent.trim();

    const price = Number(priceText.replace(/[^\d,]/g, "").replace(",", "."));
    const id = card.dataset.id;

    return { id, name, price };
  }

  function renderCart() {
    if (!cartItemsContainer) return;

    const fragment = document.createDocumentFragment();

    cartItemsContainer.innerHTML = "";

    cart.getItems().forEach((item) => {
      const cartItem = document.createElement("article");

      cartItem.className = "CartItem";
      cartItem.dataset.id = item.id;

      cartItem.innerHTML = `
        <div class="CartItem-info">
          <h3 class="CartItem-name">${item.name}</h3>
          <span class="CartItem-unit">${formatPrice(item.price)} / unité</span>
        </div>

        <div class="CartItem-controls">
          <button type="button" class="CartItem-decrease">−</button>
          <span>${item.quantity}</span>
          <button type="button" class="CartItem-increase">+</button>
        </div>

        <strong class="CartItem-total">
          ${formatPrice(item.price * item.quantity)}
        </strong>

        <button type="button" class="CartItem-remove" aria-label="Supprimer">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;

      fragment.appendChild(cartItem);
    });

    cartItemsContainer.appendChild(fragment);

    const quantity = cart.getQuantity();

    if (cartCount) {
      cartCount.textContent = `${quantity} article${quantity > 1 ? "s" : ""}`;
    }

    if (cartFloatingCount) {
      cartFloatingCount.textContent = quantity;
    }

    if (cartTotal) {
      cartTotal.textContent = formatPrice(cart.getTotal());
    }
  }

  function openCheckout() {
    if (cart.getItems().length === 0) {
      showToast("Panier vide");
      return;
    }

    if (checkoutTotalValue) {
      checkoutTotalValue.textContent = formatPrice(cart.getTotal());
    }

    checkoutOverlay?.classList.add("open");
  }

  function closeCheckout() {
    checkoutOverlay?.classList.remove("open");
  }

  function clearCart() {
    cart.clear();
    cartPanel?.classList.remove("open");
    showToast("Panier annulé");
  }

  function getSelectedPaymentMethod() {
    const activeMethod = document.querySelector(".Checkout-method.active");
    return activeMethod ? activeMethod.textContent.trim() : "Espèces";
  }

  function generateReceiptNumber() {
    return `Reçu #${String(Date.now()).slice(-6)}`;
  }

  function formatDateTime(date = new Date()) {
    return (
      date.toLocaleDateString("fr-FR") +
      " - " +
      date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  function renderReceipt(saleId) {
    if (!receiptItems) return;

    receiptItems.innerHTML = "";

    cart.getItems().forEach((item) => {
      const receiptItem = document.createElement("div");

      receiptItem.className = "Receipt-item";

      receiptItem.innerHTML = `
        <span class="Receipt-itemName">${item.name}</span>
        <span class="Receipt-itemQty">${item.quantity} × ${formatPrice(item.price)}</span>
        <strong class="Receipt-itemTotal">
          ${formatPrice(item.price * item.quantity)}
        </strong>
      `;

      receiptItems.appendChild(receiptItem);
    });

    if (receiptTotalValue) {
      receiptTotalValue.textContent = formatPrice(cart.getTotal());
    }

    if (receiptPaymentValue) {
      receiptPaymentValue.textContent = getSelectedPaymentMethod();
    }

    if (receiptNumber) {
      receiptNumber.textContent = `Reçu #${saleId}`;
    }

    if (receiptDate) {
      receiptDate.textContent = formatDateTime();
    }
  }

  function closeReceipt() {
    receiptOverlay?.classList.remove("open");
  }

  async function persistSale() {
    const payload = {
      items: cart.getItems().map((item) => ({
        productId: Number(item.id),
        quantity: item.quantity,
      })),
    };

    const response = await fetch("/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(
          error.error || "Erreur lors de l'enregistrement de la vente"
      );
    }

    return response.json();
  }

  saleProductCards.forEach((card) => {
    const cartButton = card.querySelector(".ProductCard-footer-action");

    card.addEventListener("click", () => {
      cart.add(getProductFromCard(card));

      cartFloatingButton?.classList.add("bounce");
      setTimeout(() => cartFloatingButton?.classList.remove("bounce"), 300);
    });

    cartButton?.addEventListener("click", (event) => {
      event.stopPropagation();

      cart.add(getProductFromCard(card));

      cartFloatingButton?.classList.add("bounce");
      setTimeout(() => cartFloatingButton?.classList.remove("bounce"), 300);
    });
  });

  cartItemsContainer?.addEventListener("click", (event) => {
    const cartItem = event.target.closest(".CartItem");
    if (!cartItem) return;

    const productId = cartItem.dataset.id;

    if (event.target.closest(".CartItem-decrease")) {
      cart.decrease(productId);
    }

    if (event.target.closest(".CartItem-increase")) {
      cart.increase(productId);
    }

    if (event.target.closest(".CartItem-remove")) {
      cart.remove(productId);
    }
  });

  cartFloatingButton?.addEventListener("click", () => {
    cartPanel?.classList.toggle("open");
  });

  validateButton?.addEventListener("click", openCheckout);
  cancelCartButton?.addEventListener("click", clearCart);

  checkoutMethods.forEach((button) => {
    button.addEventListener("click", () => {
      checkoutMethods.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });

  checkoutConfirm?.addEventListener("click", async () => {
    try {
      checkoutConfirm.disabled = true;
      checkoutConfirm.textContent = "Enregistrement...";

      const savedSale = await persistSale();

      renderReceipt(savedSale.saleId);

      closeCheckout();

      receiptOverlay?.classList.add("open");

      cart.clear();
      cartPanel?.classList.remove("open");

      showToast("Vente enregistrée ✅");
    } catch (error) {
      console.error(error);
      showToast(error.message);
    } finally {
      checkoutConfirm.disabled = false;
      checkoutConfirm.textContent = "Confirmer la vente";
    }
  });

  checkoutCancel?.addEventListener("click", closeCheckout);
  checkoutClose?.addEventListener("click", closeCheckout);
  checkoutBackdrop?.addEventListener("click", closeCheckout);

  receiptPrint?.addEventListener("click", () => {
    window.print();
  });

  receiptNewSale?.addEventListener("click", () => {
    closeReceipt();
    showToast("Nouvelle vente prête");
  });

  receiptClose?.addEventListener("click", closeReceipt);
  receiptBackdrop?.addEventListener("click", closeReceipt);

  renderCart();
});