import { useState } from "react";

import "./ChangePriceForm.scss";

function ChangePriceForm({
  product,
  pricing,
  onSubmit,
  onCancel,
}) {
  const [salePrice, setSalePrice] = useState(
    String(pricing.salePrice ?? ""),
  );

  const [purchasePrice, setPurchasePrice] = useState(
    String(pricing.purchasePrice ?? ""),
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const sale = Number(salePrice);
    const purchase = Number(purchasePrice);

    if (sale <= 0 || purchase <= 0) {
      setError(
        "Les prix doivent être supérieurs à zéro.",
      );

      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await onSubmit(sale, purchase);
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Impossible de modifier le prix.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="ChangePriceForm"
      onSubmit={handleSubmit}
    >
      <div className="ChangePriceForm-product">
        <span>Produit</span>

        <strong>{product.name}</strong>

        <small>
          Prix de vente actuel :{" "}
          {Number(pricing.salePrice).toLocaleString("fr-FR")} F
        </small>

        <small>
          Prix d'achat actuel :{" "}
          {Number(pricing.purchasePrice).toLocaleString("fr-FR")} F
        </small>
      </div>

      <label className="ChangePriceForm-field">
        <span>Nouveau prix de vente *</span>

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

      <label className="ChangePriceForm-field">
        <span>Prix d'achat *</span>

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

      {error && (
        <p className="ChangePriceForm-error">
          {error}
        </p>
      )}

      <div className="ChangePriceForm-actions">
        <button
          type="button"
          className="ChangePriceForm-cancel"
          disabled={submitting}
          onClick={onCancel}
        >
          Annuler
        </button>

        <button
          type="submit"
          className="ChangePriceForm-submit"
          disabled={submitting}
        >
          {submitting
            ? "Modification..."
            : "Modifier"}
        </button>
      </div>
    </form>
  );
}

export default ChangePriceForm;