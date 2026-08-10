import { useState } from "react";

import useCategories from "../../../categories/hooks/useCategories";

import "./ProductForm.scss";

function ProductForm({
  mode = "create",
  product = null,
  onSubmit,
  onCancel,
}) {
  const isEditing = mode === "edit";

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [name, setName] = useState(
    product?.name ?? "",
  );

  const [imageUrl, setImageUrl] = useState(
    product?.imageUrl ?? "",
  );

  const [categoryId, setCategoryId] = useState(
    product?.categoryId
      ? String(product.categoryId)
      : "",
  );

  const [active, setActive] = useState(
    product?.active ?? true,
  );

  const [stockQuantity, setStockQuantity] =
    useState("0");

  const [salePrice, setSalePrice] =
    useState("");

  const [purchasePrice, setPurchasePrice] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      setError(
        "Le nom du produit est obligatoire.",
      );
      return;
    }

    if (!categoryId) {
      setError(
        "La catégorie est obligatoire.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (isEditing) {
        await onSubmit({
          name: normalizedName,
          imageUrl: imageUrl.trim(),
          categoryId: Number(categoryId),
          active,
        });

        return;
      }

      if (
        stockQuantity === "" ||
        salePrice === "" ||
        purchasePrice === ""
      ) {
        setError(
          "Le stock et les prix sont obligatoires.",
        );
        return;
      }

      const stock = Number(stockQuantity);
      const sale = Number(salePrice);
      const purchase = Number(purchasePrice);

      if (
        stock < 0 ||
        sale < 0 ||
        purchase < 0
      ) {
        setError(
          "Le stock et les prix doivent être positifs.",
        );
        return;
      }

      await onSubmit({
        name: normalizedName,
        imageUrl: imageUrl.trim(),
        categoryId: Number(categoryId),
        stockQuantity: stock,
        salePrice: sale,
        purchasePrice: purchase,
      });
    } catch (requestError) {
      console.error(
        isEditing
          ? "Impossible de modifier le produit."
          : "Impossible de créer le produit.",
        requestError,
      );

      setError(
        isEditing
          ? "Impossible de modifier le produit."
          : "Impossible de créer le produit.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const availableCategories = categories.filter(
    (category) =>
      category.active ||
      (isEditing &&
        category.id === product?.categoryId),
  );

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

          {availableCategories.map((category) => (
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

      {isEditing ? (
        <label className="ProductForm-field">
          <span>Statut</span>

          <select
            value={String(active)}
            onChange={(event) =>
              setActive(
                event.target.value === "true",
              )
            }
          >
            <option value="true">
              Actif
            </option>

            <option value="false">
              Inactif
            </option>
          </select>
        </label>
      ) : (
        <>
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
                setPurchasePrice(
                  event.target.value,
                )
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
                setStockQuantity(
                  event.target.value,
                )
              }
            />
          </label>
        </>
      )}

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
            ? "Enregistrement..."
            : isEditing
              ? "Enregistrer"
              : "Créer"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;