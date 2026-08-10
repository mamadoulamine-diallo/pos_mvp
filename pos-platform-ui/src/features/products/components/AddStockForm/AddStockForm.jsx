import { useState } from "react";

import "./AddStockForm.scss";

function AddStockForm({
  product,
  onSubmit,
  onCancel,
}) {
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      setError(
        "La quantité doit être supérieure à zéro.",
      );

      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await onSubmit(parsedQuantity);
    } catch (requestError) {
      console.error(
        "Impossible d'ajouter le stock.",
        requestError,
      );

      setError(
        "Impossible d'ajouter le stock.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="AddStockForm"
      onSubmit={handleSubmit}
    >
      <div className="AddStockForm-product">
        <span>Produit</span>
        <strong>{product.name}</strong>
      </div>

      <div className="AddStockForm-current">
        Stock actuel :{" "}
        <strong>{product.stockQuantity}</strong>
      </div>

      <label className="AddStockForm-field">
        <span>Quantité à ajouter *</span>

        <input
          type="number"
          min="1"
          step="1"
          required
          autoFocus
          value={quantity}
          onChange={(event) =>
            setQuantity(event.target.value)
          }
        />
      </label>

      {error && (
        <p className="AddStockForm-error">
          {error}
        </p>
      )}

      <div className="AddStockForm-actions">
        <button
          type="button"
          className="AddStockForm-cancel"
          disabled={submitting}
          onClick={onCancel}
        >
          Annuler
        </button>

        <button
          type="submit"
          className="AddStockForm-submit"
          disabled={submitting}
        >
          {submitting
            ? "Ajout..."
            : "Ajouter"}
        </button>
      </div>
    </form>
  );
}

export default AddStockForm;