import { createCategory, updateCategory } from "./category-api.js";
import { showToast } from "../components/toast.js";


export function initCategoryForms() {
    const addCategoryOverlay = document.querySelector(".AddCategoryOverlay");
    const addCategoryButtons = document.querySelectorAll(
        ".Products-actions-addCategoryDesktop"
    );
    const addCategoryForm = document.querySelector(".AddCategoryForm");
    const editCategoryOverlay = document.querySelector(".EditCategoryOverlay");
    const editCategoryButtons = document.querySelectorAll(
        ".Products-actions-editCategoryDesktop"
    );
    const editCategoryForm = document.querySelector(".EditCategoryForm");

    function openOverlay(overlay) {
        overlay?.classList.add("open");
    }

    addCategoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            openOverlay(addCategoryOverlay);
        });
    });

    addCategoryForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(addCategoryForm);

        const payload = {
            name: formData.get("name"),
        };

        try {
            await createCategory(payload);
            showToast("Catégorie créée avec succès");
            setTimeout(() => window.location.reload(), 600);
        } catch (error) {
            console.error(error);
            showToast(error.message, "error");
        }
    });

    editCategoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            editCategoryOverlay?.classList.add("open");
        });
    });

    editCategoryForm?.categoryId?.addEventListener("change", () => {
        const selectedOption =
            editCategoryForm.categoryId.options[editCategoryForm.categoryId.selectedIndex];

        editCategoryForm.name.value = selectedOption.textContent.trim();
        editCategoryForm.active.value =
            selectedOption.dataset.active === "true" ? "true" : "false";
    });

    editCategoryForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(editCategoryForm);
        const categoryId = formData.get("categoryId");

        const payload = {
            name: formData.get("name"),
            active: formData.get("active") === "true",
        };

        try {
            await updateCategory(categoryId, payload);
            showToast("Catégorie modifiée avec succès");
            setTimeout(() => window.location.reload(), 600);
        } catch (error) {
            console.error(error);
            showToast(error.message, "error");
        }
    });
}