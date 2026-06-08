export function initReceipt({ cart, formatPrice, getSelectedPaymentMethod }) {
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

        if (receiptTotalValue) receiptTotalValue.textContent = formatPrice(cart.getTotal());
        if (receiptPaymentValue) receiptPaymentValue.textContent = getSelectedPaymentMethod();
        if (receiptNumber) receiptNumber.textContent = `Reçu #${saleId}`;
        if (receiptDate) receiptDate.textContent = formatDateTime();
    }

    function openReceipt() {
        receiptOverlay?.classList.add("open");
    }

    function closeReceipt() {
        receiptOverlay?.classList.remove("open");
    }

    receiptPrint?.addEventListener("click", () => window.print());

    receiptNewSale?.addEventListener("click", () => {
        closeReceipt();
    });

    receiptClose?.addEventListener("click", closeReceipt);
    receiptBackdrop?.addEventListener("click", closeReceipt);

    return {
        renderReceipt,
        openReceipt,
        closeReceipt,
    };
}