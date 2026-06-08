const addProductOverlay = document.querySelector(".AddProductOverlay");
const productPreviewOverlay = document.querySelector(".ProductPreviewOverlay");
const addStockOverlay = document.querySelector(".AddStockOverlay");

const addProductButtons = document.querySelectorAll(
    ".Products-actions-addProductDesktop, .Products-actions-addProductMobile"
);

const productCards = document.querySelectorAll(".ProductCard");
const cartButtons = document.querySelectorAll(".ProductCard-footer-action");

const addProductForm = document.querySelector(".AddProductForm");
const addStockForm = document.querySelector(".AddStockForm");

const previewImage = document.querySelector(".ProductPreview-image");
const previewName = document.querySelector(".ProductPreview-name");
const previewStock = document.querySelector(".ProductPreview-stock");
const previewPrice = document.querySelector(".ProductPreview-price");
const previewStatus = document.querySelector(".ProductPreview-status");

const addStockButton = document.querySelector(".ProductPreview-addStock");
const stockProductIdInput = document.querySelector('.AddStockForm input[name="productId"]');

const editProductOverlay = document.querySelector(".EditProductOverlay");
const editProductButton = document.querySelector(".ProductPreview-edit");
const editProductForm = document.querySelector(".EditProductForm");

const changePriceOverlay = document.querySelector(".ChangePriceOverlay");
const changePriceButton = document.querySelector(".ProductPreview-changePrice");
const changePriceForm = document.querySelector(".ChangePriceForm");

const productDetailsLink = document.querySelector(".ProductPreview-link");

const searchInput = document.querySelector(".Products-actions-search-input");


let currentProductId = null;

function openOverlay(overlay) {
  overlay?.classList.add("open");
}

function closeOverlay(overlay) {
  overlay?.classList.remove("open");
}

function getProductFromCard(card) {
  return {
    id: card.dataset.id,
    name: card.dataset.name,
    stock: card.dataset.stock,
    price: card.dataset.price,
    status: card.dataset.status === "true" ? "Actif" : "Inactif",
    image: card.dataset.image,
    categoryId: card.dataset.categoryId
  };
}

function updatePreview(product) {
  if (previewName) previewName.textContent = product.name;
  if (previewStock) previewStock.textContent = product.stock;

  if (previewPrice) {
    previewPrice.textContent = `${Number(product.price).toLocaleString(
        "fr-FR"
    )} F`;
    if (productDetailsLink) {
      productDetailsLink.href = `/products/${product.id}`;
    }
  }

  if (previewStatus) previewStatus.textContent = product.status;

  if (previewImage) {
    previewImage.src = product.image
        ? `/assets/styles/img/${product.image}`
        : "/assets/styles/img/default-product.webp";

    previewImage.onerror = () => {
      previewImage.src = "/assets/styles/img/default-product.webp";
    };
  }
}

addProductButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openOverlay(addProductOverlay);
  });
});

productCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (!productPreviewOverlay) return;

    const product = getProductFromCard(card);

    currentProductId = product.id;
    updatePreview(product);
    openOverlay(productPreviewOverlay);
  });
});

cartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    window.location.href = "/sales/new";
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

addStockButton?.addEventListener("click", () => {
  if (!currentProductId) return;

  if (stockProductIdInput) {
    stockProductIdInput.value = currentProductId;
  }

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
    const response = await fetch("/products/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout du stock");
    }

    window.location.reload();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

editProductButton?.addEventListener("click", () => {
  if (!currentProductId || !editProductForm) return;

  editProductForm.productId.value = currentProductId;
  editProductForm.name.value = previewName.textContent.trim();
  editProductForm.imageUrl.value =
      previewImage?.src.split("/").pop() || "";
  editProductForm.categoryId.value =
      document
          .querySelector(`.ProductCard[data-id="${currentProductId}"]`)
          ?.dataset.categoryId || "";
  editProductForm.active.value =
      previewStatus.textContent.trim() === "Actif" ? "true" : "false";

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
    const response = await fetch(`/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la modification du produit");
    }

    window.location.reload();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

changePriceButton?.addEventListener("click", () => {

      changePriceForm.productId.value = currentProductId;
      closeOverlay(productPreviewOverlay);
      openOverlay(changePriceOverlay);
    }
);

changePriceForm?.addEventListener("submit", async (event) => {

      event.preventDefault();

      const formData = new FormData(changePriceForm);

      const payload = {productId: Number(formData.get("productId")),

        salePrice: Number(formData.get("salePrice")),
        purchasePrice: Number(formData.get("purchasePrice")),
      };

      const response =
          await fetch("/products/price",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                      "application/json",
                },
                body: JSON.stringify(payload),
              }
          );

      if (response.ok) {
        window.location.reload();
      }
    }
);

let selectedCategory = "all";
let selectedFilter = "all";
let searchQuery = "";

function applyProductFilters() {
  productCards.forEach((card) => {
    const name = (card.dataset.name || "").toLowerCase();
    const categoryId = card.dataset.categoryId;
    const stock = Number(card.dataset.stock);
    const isActive = card.dataset.status === "true";

    const matchesSearch =
        !searchQuery || name.includes(searchQuery);

    const matchesCategory =
        selectedCategory === "all" || categoryId === selectedCategory;

    let matchesFilter = true;

    if (selectedFilter === "low-stock") {
      matchesFilter = isActive && stock > 0 && stock <= 5;
    }

    if (selectedFilter === "out-stock") {
      matchesFilter = isActive && stock === 0;
    }

    if (selectedFilter === "inactive") {
      matchesFilter = !isActive;
    }

    card.style.display =
        matchesSearch && matchesCategory && matchesFilter
            ? ""
            : "none";
  });
}

searchInput?.addEventListener("input", () => {
  searchQuery = searchInput.value.trim().toLowerCase();
  applyProductFilters();
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    selectedCategory = button.dataset.categoryId || "all";
    applyProductFilters();
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    selectedFilter = button.dataset.filter || "all";
    applyProductFilters();
  });
});

const notificationTrigger = document.querySelector(".HeaderNotification-trigger");

notificationTrigger?.addEventListener("click", (event) => {
  event.stopPropagation();
  notification?.classList.toggle("open");
});

document.addEventListener("click", () => {
  notification?.classList.remove("open");
});