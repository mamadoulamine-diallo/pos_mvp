export function getProductFromCard(card) {
    return {
        id: card.dataset.id,
        name: card.dataset.name,
        stock: card.dataset.stock,
        price: card.dataset.price,
        status: card.dataset.status === "true" ? "Actif" : "Inactif",
        image: card.dataset.image,
        categoryId: card.dataset.categoryId,
    };
}

export function initProductPreview({ setCurrentProductId }) {
    const productPreviewOverlay = document.querySelector(".ProductPreviewOverlay");
    const productCards = document.querySelectorAll(".ProductCard");

    const previewImage = document.querySelector(".ProductPreview-image");
    const previewName = document.querySelector(".ProductPreview-name");
    const previewStock = document.querySelector(".ProductPreview-stock");
    const previewPrice = document.querySelector(".ProductPreview-price");
    const previewStatus = document.querySelector(".ProductPreview-status");
    const productDetailsLink = document.querySelector(".ProductPreview-link");

    function updatePreview(product) {
        if (previewName) previewName.textContent = product.name;
        if (previewStock) previewStock.textContent = product.stock;

        if (previewPrice) {
            previewPrice.textContent = `${Number(product.price).toLocaleString("fr-FR")} F`;
        }

        if (previewStatus) previewStatus.textContent = product.status;

        if (productDetailsLink) {
            productDetailsLink.href = `/products/${product.id}`;
        }

        if (previewImage) {
            previewImage.src = product.image
                ? `/assets/styles/img/${product.image}`
                : "/assets/styles/img/default-product.webp";

            previewImage.onerror = () => {
                previewImage.src = "/assets/styles/img/default-product.webp";
            };
        }
    }

    productCards.forEach((card) => {
        card.addEventListener("click", () => {
            const product = getProductFromCard(card);

            setCurrentProductId(product.id);
            updatePreview(product);

            productPreviewOverlay?.classList.add("open");
        });
    });
}