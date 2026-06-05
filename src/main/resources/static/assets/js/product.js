const addProductButton = document.querySelector(".Products-actions-addProductDesktop");
const addProductOverlay = document.querySelector(".AddProductOverlay");

const productPreviewOverlay = document.querySelector(".ProductPreviewOverlay");
const productCards = document.querySelectorAll(".ProductCard");

const cartButtons = document.querySelectorAll(".ProductCard-footer-action");
const addProductForm = document.querySelector(".AddProductForm");

const previewImage = document.querySelector(".ProductPreview-image");
const previewName = document.querySelector(".ProductPreview-name");
const previewStock = document.querySelector(".ProductPreview-stock");
const previewPrice = document.querySelector(".ProductPreview-price");
const previewStatus = document.querySelector(".ProductPreview-status");

if (addProductButton && addProductOverlay) {
  addProductButton.addEventListener("click", () => {
    addProductOverlay.classList.add("open");
  });
}

const isProductsPage = document.querySelector(".Products");

if (isProductsPage && productPreviewOverlay) {
  productCards.forEach((card) => {
    card.addEventListener("click", () => {
      productPreviewOverlay.classList.add("open");
    });
  });
}

cartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    window.location.href = "/sales/new";
  });
});

const addProductButtons = document.querySelectorAll(
    ".Products-actions-addProductDesktop, .Products-actions-addProductMobile"
);

addProductButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addProductOverlay?.classList.add("open");
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
    const response = await fetch("/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création du produit");
    }

    window.location.reload();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

productCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (!productPreviewOverlay) return;

    const name = card.dataset.name;
    const stock = card.dataset.stock;
    const price = card.dataset.price;
    const status = card.dataset.status === "true" ? "Actif" : "Inactif";
    const image = card.dataset.image;

    if (previewName) previewName.textContent = name;
    if (previewStock) previewStock.textContent = stock;
    if (previewPrice) previewPrice.textContent = `${Number(price).toLocaleString("fr-FR")} F`;
    if (previewStatus) previewStatus.textContent = status;

    if (previewImage) {
      previewImage.src = image
          ? `/assets/styles/img/${image}`
          : "/assets/styles/img/default-product.webp";

      previewImage.onerror = () => {
        previewImage.src = "/assets/styles/img/default-product.webp";
      };
    }

    productPreviewOverlay.classList.add("open");
  });
});