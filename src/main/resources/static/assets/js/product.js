const addProductButton = document.querySelector(".Products-actions-addProductDesktop");
const addProductOverlay = document.querySelector(".AddProductOverlay");

const productPreviewOverlay = document.querySelector(".ProductPreviewOverlay");
const productCards = document.querySelectorAll(".ProductCard");

const cartButtons = document.querySelectorAll(".ProductCard-footer-action");

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