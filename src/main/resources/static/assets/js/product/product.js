import { initNotifications } from "../components/notifications.js";
import { initProductPreview } from "./product-preview.js";
import { initProductForms } from "./product-forms.js";
import { initProductFilters } from "./product-filters.js";

document.addEventListener("DOMContentLoaded", () => {
  let currentProductId = null;

  initProductPreview({
    setCurrentProductId: (id) => {
      currentProductId = id;
    },
  });

  initProductForms({
    getCurrentProductId: () => currentProductId,
  });

  initProductFilters();
  initNotifications();

  const cartButtons = document.querySelectorAll(".ProductCard-footer-action");

  cartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      window.location.href = "/sales/new";
    });
  });
});