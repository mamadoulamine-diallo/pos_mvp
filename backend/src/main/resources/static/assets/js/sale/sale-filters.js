export function initSaleFilters() {
    const cards = document.querySelectorAll(".SaleProducts .ProductCard");
    const searchInput = document.querySelector(".SaleProducts-search-input");
    const categoryButtons = document.querySelectorAll(".Categories-button");

    let selectedCategory = "all";
    let searchQuery = "";

    function applyFilters() {
        cards.forEach((card) => {
            const name = (card.dataset.name || "").toLowerCase();
            const categoryId = card.dataset.categoryId;

            const matchesSearch = !searchQuery || name.includes(searchQuery);
            const matchesCategory =
                selectedCategory === "all" || categoryId === selectedCategory;

            card.style.display = matchesSearch && matchesCategory ? "" : "none";
        });
    }

    searchInput?.addEventListener("input", () => {
        searchQuery = searchInput.value.trim().toLowerCase();
        applyFilters();
    });

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            categoryButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            selectedCategory = button.dataset.categoryId || "all";
            applyFilters();
        });
    });
}