function CategoryCard({ category }) {
  return (
    <article className="CategoryCard">
      <div className="CategoryCard-info">
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
          {category.active ? "Active" : "Inactive"}
        </span>
      </div>
    </article>
  );
}

export default CategoryCard;