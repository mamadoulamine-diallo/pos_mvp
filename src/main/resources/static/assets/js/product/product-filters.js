export function initProductFilters() {
    const productCards = document.querySelectorAll(".ProductCard");
    const searchInput = document.querySelector(".Products-actions-search-input");
    const categoryButtons = document.querySelectorAll(".Categories-button");
    const filterButtons = document.querySelectorAll(".Filter-list-item");

    let selectedCategory = "all";
    let selectedFilter = "all";
    let searchQuery = "";

    function applyProductFilters() {
        productCards.forEach((card) => {
            const name = (card.dataset.name || "").toLowerCase();
            const categoryId = card.dataset.categoryId;
            const stock = Number(card.dataset.stock);
            const isActive = card.dataset.status === "true";

            const matchesSearch = !searchQuery || name.includes(searchQuery);
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
                matchesSearch && matchesCategory && matchesFilter ? "" : "none";
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
}