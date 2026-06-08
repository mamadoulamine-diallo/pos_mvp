import { persistSale } from "./sale-api.js";

export function initCheckout({
                                 cart,
                                 cartPanel,
                                 formatPrice,
                                 showToast,
                                 receipt,
                             }) {
    const validateButton = document.querySelector(".CartPanel-validate");

    const checkoutOverlay = document.querySelector(".CheckoutOverlay");
    const checkoutTotalValue = document.querySelector(".Checkout-total-value");
    const checkoutMethods = document.querySelectorAll(".Checkout-method");
    const checkoutConfirm = document.querySelector(".Checkout-confirm");
    const checkoutCancel = document.querySelector(".Checkout-cancel");
    const checkoutClose = document.querySelector(".CheckoutOverlay .Overlay-close");
    const checkoutBackdrop = document.querySelector(".CheckoutOverlay .Overlay-backdrop");

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

    function getSelectedPaymentMethod() {
        const activeMethod = document.querySelector(".Checkout-method.active");
        return activeMethod ? activeMethod.textContent.trim() : "Espèces";
    }

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

            const savedSale = await persistSale(cart.getItems());

            receipt.renderReceipt(savedSale.saleId);

            closeCheckout();
            receipt.openReceipt();

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

    validateButton?.addEventListener("click", openCheckout);
    checkoutCancel?.addEventListener("click", closeCheckout);
    checkoutClose?.addEventListener("click", closeCheckout);
    checkoutBackdrop?.addEventListener("click", closeCheckout);

    return {
        getSelectedPaymentMethod,
    };
}