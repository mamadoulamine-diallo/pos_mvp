import CategoryCard from "../CategoryCard";

function CategoryList({
  categories,
  onEdit,
}) {
  if (categories.length === 0) {
    return (
      <p className="Categories-empty">
        Aucune catégorie disponible.
      </p>
    );
  }

  return (
    <section className="Categories-list">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEdit}
        />
      ))}
    </section>
  );
}

export default CategoryList;