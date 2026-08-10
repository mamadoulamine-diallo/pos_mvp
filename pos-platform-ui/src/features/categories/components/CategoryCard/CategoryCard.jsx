import { Pencil } from "lucide-react";

function CategoryCard({
  category,
  onEdit,
}) {
  return (
    <article className="CategoryCard">
      <div className="CategoryCard-info">
        <div className="CategoryCard-main">
          <strong className="CategoryCard-name">
            {category.name}
          </strong>

          <span
            className={
              category.active
                ? "CategoryCard-status CategoryCard-status--active"
                : "CategoryCard-status CategoryCard-status--inactive"
            }
          >
            {category.active
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        <button
          type="button"
          className="CategoryCard-edit"
          aria-label={`Modifier ${category.name}`}
          onClick={() => onEdit(category)}
        >
          <Pencil size={18} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default CategoryCard;