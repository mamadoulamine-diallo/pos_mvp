import { Plus } from "lucide-react";
import { useState } from "react";

import CategoryForm from "../components/CategoryForm";
import CategoryList from "../components/CategoryList";
import CategoryModal from "../components/CategoryModal";
import useCategories from "../hooks/useCategories";

import "./CategoriesPage.scss";

function CategoriesPage() {
  const { categories, loading, error, createCategory, updateCategory } =
    useCategories();

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  async function handleCreate(request) {
    await createCategory(request);

    setCreateOpen(false);
  }

  async function handleUpdate(request) {
    if (!selectedCategory) {
      return;
    }

    await updateCategory(selectedCategory.id, request);

    setSelectedCategory(null);
  }

  return (
    <main className="CategoriesPage">
      <header className="CategoriesPage-header">
        <div>
          <p className="CategoriesPage-eyebrow">Catalogue</p>

          <h1>Catégories</h1>

          <p className="CategoriesPage-subtitle">
            Organisez les produits de votre catalogue.
          </p>
        </div>

        <button
          type="button"
          className="CategoriesPage-addButton"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={18} aria-hidden="true" />
          Nouvelle catégorie
        </button>
      </header>

      {loading && (
        <p className="Categories-message">Chargement des catégories...</p>
      )}

      {error && (
        <p className="Categories-message Categories-message--error">{error}</p>
      )}

      {!loading && !error && (
        <CategoryList categories={categories} onEdit={setSelectedCategory} />
      )}

      <CategoryModal
        open={createOpen}
        title="Nouvelle catégorie"
        onClose={() => setCreateOpen(false)}
      >
        <CategoryForm
          key="create-category"
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </CategoryModal>

      <CategoryModal
        open={Boolean(selectedCategory)}
        title="Modifier la catégorie"
        onClose={() => setSelectedCategory(null)}
      >
        <CategoryForm
          key={selectedCategory?.id}
          category={selectedCategory}
          onSubmit={handleUpdate}
          onCancel={() => setSelectedCategory(null)}
        />
      </CategoryModal>
    </main>
  );
}

export default CategoriesPage;
