import { createCategory } from "./category-api.js";

export function initCategoryForms() {
    const addCategoryOverlay = document.querySelector(".AddCategoryOverlay");
    const addCategoryButtons = document.querySelectorAll(
        ".Products-actions-addCategoryDesktop"
    );
    const addCategoryForm = document.querySelector(".AddCategoryForm");

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
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });
}