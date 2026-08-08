import { Plus } from "lucide-react";

import CategoryList from "../components/CategoryList";
import useCategories from "../hooks/useCategories";

import "./CategoriesPage.scss";

function CategoriesPage() {
  const {
    categories,
    loading,
    error,
  } = useCategories();

  return (
    <main className="CategoriesPage">
      <header className="CategoriesPage-header">
        <div>
          <p className="CategoriesPage-eyebrow">
            Catalogue
          </p>

          <h1>Catégories</h1>

          <p className="CategoriesPage-subtitle">
            Organisez les produits de votre catalogue.
          </p>
        </div>

        <button
          type="button"
          className="CategoriesPage-addButton"
        >
          <Plus size={18} aria-hidden="true" />
          Nouvelle catégorie
        </button>
      </header>

      {loading && (
        <p className="Categories-message">
          Chargement des catégories...
        </p>
      )}

      {error && (
        <p className="Categories-message Categories-message--error">
          {error}
        </p>
      )}

      {!loading && !error && (
        <CategoryList categories={categories} />
      )}
    </main>
  );
}

export default CategoriesPage;