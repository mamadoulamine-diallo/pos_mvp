import useCategories from "../../../categories/hooks/useCategories";
import "./SaleCategoryFilter.scss"


function SaleCategoryFilter({
  value,
  onChange,
}) {
  const {
    categories,
    loading,
  } = useCategories();

  return (
    <div className="SaleCategoryFilter">
      <button
        type="button"
        className={
          value === "all"
            ? "SaleCategoryFilter-button active"
            : "SaleCategoryFilter-button"
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
                  ? "SaleCategoryFilter-button active"
                  : "SaleCategoryFilter-button"
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

export default SaleCategoryFilter;