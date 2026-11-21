import useCategories from "../../../categories/hooks/useCategories";

import "./ProductCategoryFilter.scss";

function ProductCategoryFilter({
  value,
  onChange,
}) {
  const {
    categories,
    loading,
  } = useCategories();

  return (
    <div className="ProductCategoryFilter">
      <button
        type="button"
        className={
          value === "all"
            ? "ProductCategoryFilter-button active"
            : "ProductCategoryFilter-button"
        }
        onClick={() => onChange("all")}
      >
        Tous
      </button>

      {!loading &&
        categories
          .filter((category) => category.active)
          .map((category) => (
            <button
              key={category.id}
              type="button"
              className={
                Number(value) === category.id
                  ? "ProductCategoryFilter-button active"
                  : "ProductCategoryFilter-button"
              }
              onClick={() =>
                onChange(String(category.id))
              }
            >
              {category.name}
            </button>
          ))}
    </div>
  );
}

export default ProductCategoryFilter;