import { createCart } from "../components/cart.js";
import { initNotifications } from "../components/notifications.js";
import { initSaleFilters } from "./sale-filters.js";
import { initSaleCartUi } from "./sale-cart-ui.js";
import { initCheckout } from "./checkout.js";
import { initReceipt } from "./receipt.js";

document.addEventListener("DOMContentLoaded", () => {
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

    let renderCartRef = null;

    const cart = createCart({
        onChange: () => renderCartRef?.(),
        onToast: showToast,
    });

    const cartUi = initSaleCartUi({
        cart,
        formatPrice,
        showToast,
    });

    renderCartRef = cartUi.renderCart;

    let getSelectedPaymentMethodRef = () => "Espèces";

    const receipt = initReceipt({
        cart,
        formatPrice,
        getSelectedPaymentMethod: () => getSelectedPaymentMethodRef(),
    });

    const checkout = initCheckout({
        cart,
        cartPanel: cartUi.cartPanel,
        formatPrice,
        showToast,
        receipt,
    });

    getSelectedPaymentMethodRef = checkout.getSelectedPaymentMethod;

    initSaleFilters();
    initNotifications();
});