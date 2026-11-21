export function initSaleCartUi({ cart, formatPrice, showToast }) {
    const saleProductCards = document.querySelectorAll(".SaleProducts .ProductCard");
    const cartPanel = document.querySelector(".CartPanel");
    const cartFloatingButton = document.querySelector(".CartFloatingButton");
    const cartItemsContainer = document.querySelector(".CartPanel-items");
    const cartCount = document.querySelector(".CartPanel-count");
    const cartFloatingCount = document.querySelector(".CartFloatingButton-count");
    const cartTotal = document.querySelector(".CartPanel-total strong");
    const cancelCartButton = document.querySelector(".CartPanel-cancel");

    function getProductFromCard(card) {
        const name = card.querySelector(".ProductCard-media-name").textContent.trim();

        const priceText = card
            .querySelector(".ProductCard-footer-price")
            .textContent.trim();

        const price = Number(priceText.replace(/[^\d,]/g, "").replace(",", "."));
        const id = card.dataset.id;

        return { id, name, price };
    }

    function bounceCartButton() {
        cartFloatingButton?.classList.add("bounce");
        setTimeout(() => cartFloatingButton?.classList.remove("bounce"), 300);
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

    function clearCart() {
        cart.clear();
        cartPanel?.classList.remove("open");
        showToast("Panier annulé");
    }

    saleProductCards.forEach((card) => {
        const cartButton = card.querySelector(".ProductCard-footer-action");

        card.addEventListener("click", () => {
            cart.add(getProductFromCard(card));
            bounceCartButton();
        });

        cartButton?.addEventListener("click", (event) => {
            event.stopPropagation();
            cart.add(getProductFromCard(card));
            bounceCartButton();
        });
    });

    cartItemsContainer?.addEventListener("click", (event) => {
        const cartItem = event.target.closest(".CartItem");
        if (!cartItem) return;

        const productId = cartItem.dataset.id;

        if (event.target.closest(".CartItem-decrease")) cart.decrease(productId);
        if (event.target.closest(".CartItem-increase")) cart.increase(productId);
        if (event.target.closest(".CartItem-remove")) cart.remove(productId);
    });

    cartFloatingButton?.addEventListener("click", () => {
        cartPanel?.classList.toggle("open");
    });

    cancelCartButton?.addEventListener("click", clearCart);

    renderCart();

    return {
        renderCart,
        cartPanel,
    };
}