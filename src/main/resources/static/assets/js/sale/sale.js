import { createCart } from "../components/cart.js";
import { initNotifications } from "../components/notifications.js";
import { initSaleFilters } from "./sale-filters.js";
import { initSaleCartUi } from "./sale-cart-ui.js";
import { initCheckout } from "./checkout.js";
import { initReceipt } from "./receipt.js";
import { showToast } from "../components/toast.js";

document.addEventListener("DOMContentLoaded", () => {
    function formatPrice(price) {
        return `${price.toLocaleString("fr-FR")} F`;
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