import {
    createProduct,
    updateProduct,
    addStock,
    changePrice,
} from "./product-api.js";

export function initProductForms({ getCurrentProductId, showToast }) {
    const addProductOverlay = document.querySelector(".AddProductOverlay");
    const productPreviewOverlay = document.querySelector(".ProductPreviewOverlay");
    const addStockOverlay = document.querySelector(".AddStockOverlay");
    const editProductOverlay = document.querySelector(".EditProductOverlay");
    const changePriceOverlay = document.querySelector(".ChangePriceOverlay");

    const addProductButtons = document.querySelectorAll(
        ".Products-actions-addProductDesktop, .Products-actions-addProductMobile"
    );

    const addProductForm = document.querySelector(".AddProductForm");
    const addStockForm = document.querySelector(".AddStockForm");
    const editProductForm = document.querySelector(".EditProductForm");
    const changePriceForm = document.querySelector(".ChangePriceForm");

    const addStockButton = document.querySelector(".ProductPreview-addStock");
    const editProductButton = document.querySelector(".ProductPreview-edit");
    const changePriceButton = document.querySelector(".ProductPreview-changePrice");

    const previewName = document.querySelector(".ProductPreview-name");
    const previewImage = document.querySelector(".ProductPreview-image");
    const previewStatus = document.querySelector(".ProductPreview-status");

    function openOverlay(overlay) {
        overlay?.classList.add("open");
    }

    function closeOverlay(overlay) {
        overlay?.classList.remove("open");
    }

    function reloadAfterToast() {
        setTimeout(() => {
            window.location.reload();
        }, 650);
    }

    addProductButtons.forEach((button) => {
        button.addEventListener("click", () => {
            openOverlay(addProductOverlay);
        });
    });

    addProductForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(addProductForm);

        const payload = {
            name: formData.get("name"),
            imageUrl: formData.get("imageUrl"),
            categoryId: Number(formData.get("categoryId")),
            stockQuantity: Number(formData.get("stockQuantity")),
            salePrice: Number(formData.get("salePrice")),
            purchasePrice: Number(formData.get("purchasePrice")),
        };

        try {
            await createProduct(payload);
            showToast("Produit créé avec succès");
            reloadAfterToast();
        } catch (error) {
            console.error(error);
            showToast(error.message, "error");
        }
    });

    addStockButton?.addEventListener("click", () => {
        const productId = getCurrentProductId();

        if (!productId || !addStockForm) return;

        addStockForm.productId.value = productId;

        closeOverlay(productPreviewOverlay);
        openOverlay(addStockOverlay);
    });

    addStockForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(addStockForm);

        const payload = {
            productId: Number(formData.get("productId")),
            quantity: Number(formData.get("quantity")),
        };

        try {
            await addStock(payload);
            showToast("Stock ajouté avec succès");
            reloadAfterToast();
        } catch (error) {
            console.error(error);
            showToast(error.message, "error");
        }
    });

    editProductButton?.addEventListener("click", () => {
        const productId = getCurrentProductId();

        if (!productId || !editProductForm) return;

        const currentCard = document.querySelector(`.ProductCard[data-id="${productId}"]`);

        editProductForm.productId.value = productId;
        editProductForm.name.value = previewName?.textContent.trim() || "";
        editProductForm.imageUrl.value = previewImage?.src.split("/").pop() || "";
        editProductForm.categoryId.value = currentCard?.dataset.categoryId || "";
        editProductForm.active.value =
            previewStatus?.textContent.trim() === "Actif" ? "true" : "false";

        closeOverlay(productPreviewOverlay);
        openOverlay(editProductOverlay);
    });

    editProductForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(editProductForm);
        const productId = formData.get("productId");

        const payload = {
            name: formData.get("name"),
            imageUrl: formData.get("imageUrl"),
            categoryId: Number(formData.get("categoryId")),
            active: formData.get("active") === "true",
        };

        try {
            await updateProduct(productId, payload);
            showToast("Produit modifié avec succès");
            reloadAfterToast();
        } catch (error) {
            console.error(error);
            showToast(error.message, "error");
        }
    });

    changePriceButton?.addEventListener("click", () => {
        const productId = getCurrentProductId();

        if (!productId || !changePriceForm) return;

        changePriceForm.productId.value = productId;

        closeOverlay(productPreviewOverlay);
        openOverlay(changePriceOverlay);
    });

    changePriceForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(changePriceForm);

        const payload = {
            productId: Number(formData.get("productId")),
            salePrice: Number(formData.get("salePrice")),
            purchasePrice: Number(formData.get("purchasePrice")),
        };

        try {
            await changePrice(payload);
            showToast("Prix modifié avec succès");
            reloadAfterToast();
        } catch (error) {
            console.error(error);
            showToast(error.message, "error");
        }
    });
}