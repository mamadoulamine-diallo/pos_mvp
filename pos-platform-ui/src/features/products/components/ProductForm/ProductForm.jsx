import { useState } from "react";

import useCategories from "../../../categories/hooks/useCategories";

import "./ProductForm.scss";

function ProductForm({
  onSubmit,
  onCancel,
}) {
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [salePrice, setSalePrice] = useState("");
  const [purchasePrice, setPurchasePrice] =
    useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      setError("Le nom du produit est obligatoire.");
      return;
    }

    if (!categoryId) {
      setError("La catégorie est obligatoire.");
      return;
    }

    if (
      Number(stockQuantity) < 0 ||
      Number(salePrice) < 0 ||
      Number(purchasePrice) < 0
    ) {
      setError(
        "Le stock et les prix doivent être positifs.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await onSubmit({
        name: normalizedName,
        imageUrl: imageUrl.trim(),
        categoryId: Number(categoryId),
        stockQuantity: Number(stockQuantity),
        salePrice: Number(salePrice),
        purchasePrice: Number(purchasePrice),
      });
    } catch (requestError) {
      console.error(
        "Impossible de créer le produit.",
        requestError,
      );

      setError(
        "Impossible de créer le produit.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="ProductForm"
      onSubmit={handleSubmit}
    >
      <label className="ProductForm-field">
        <span>Image produit</span>

        <input
          type="text"
          placeholder="riz.webp"
          value={imageUrl}
          onChange={(event) =>
            setImageUrl(event.target.value)
          }
        />
      </label>

      <label className="ProductForm-field">
        <span>Nom *</span>

        <input
          type="text"
          required
          autoFocus
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
        />
      </label>

      <label className="ProductForm-field">
        <span>Catégorie *</span>

        <select
          value={categoryId}
          required
          disabled={categoriesLoading}
          onChange={(event) =>
            setCategoryId(event.target.value)
          }
        >
          <option value="">
            {categoriesLoading
              ? "Chargement..."
              : "Choisir une catégorie"}
          </option>

          {categories
            .filter((category) => category.active)
            .map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
        </select>
      </label>

      {categoriesError && (
        <p className="ProductForm-error">
          Impossible de charger les catégories.
        </p>
      )}

      <label className="ProductForm-field">
        <span>Prix vente *</span>

        <input
          type="number"
          min="0"
          step="0.01"
          required
          value={salePrice}
          onChange={(event) =>
            setSalePrice(event.target.value)
          }
        />
      </label>

      <label className="ProductForm-field">
        <span>Prix achat *</span>

        <input
          type="number"
          min="0"
          step="0.01"
          required
          value={purchasePrice}
          onChange={(event) =>
            setPurchasePrice(event.target.value)
          }
        />
      </label>

      <label className="ProductForm-field">
        <span>Stock initial *</span>

        <input
          type="number"
          min="0"
          step="1"
          required
          value={stockQuantity}
          onChange={(event) =>
            setStockQuantity(event.target.value)
          }
        />
      </label>

      {error && (
        <p className="ProductForm-error">
          {error}
        </p>
      )}

      <div className="ProductForm-actions">
        <button
          type="button"
          className="ProductForm-cancel"
          disabled={submitting}
          onClick={onCancel}
        >
          Annuler
        </button>

        <button
          type="submit"
          className="ProductForm-submit"
          disabled={
            submitting ||
            categoriesLoading ||
            Boolean(categoriesError)
          }
        >
          {submitting
            ? "Création..."
            : "Créer"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;