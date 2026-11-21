import { createCategory, updateCategory } from "./category-api.js";
import { showToast } from "../components/toast.js";

export function initCategoryForms() {
    const addCategoryOverlay = document.querySelector(".AddCategoryOverlay");
    const editCategoryOverlay = document.querySelector(".EditCategoryOverlay");

    const addCategoryButton = document.querySelector(
        ".Products-actions-addCategory"
    );

    const manageCategoriesButton = document.querySelector(
        ".Products-actions-manageCategories"
    );

    const addCategoryForm = document.querySelector(".AddCategoryForm");
    const editCategoryForm = document.querySelector(".EditCategoryForm");

    function openOverlay(overlay) {
        overlay?.classList.add("open");
    }

    function reloadAfterToast() {
        setTimeout(() => {
            window.location.reload();
        }, 600);
    }

    addCategoryButton?.addEventListener("click", () => {
        openOverlay(addCategoryOverlay);
    });

    manageCategoriesButton?.addEventListener("click", () => {
        openOverlay(editCategoryOverlay);
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
            reloadAfterToast();
        } catch (error) {
            console.error(error);
            showToast(error.message, "error");
        }
    });

    editCategoryForm?.categoryId?.addEventListener("change", () => {
        const selectedOption =
            editCategoryForm.categoryId.options[
                editCategoryForm.categoryId.selectedIndex
            ];

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
            reloadAfterToast();
        } catch (error) {
            console.error(error);
            showToast(error.message, "error");
        }
    });
}