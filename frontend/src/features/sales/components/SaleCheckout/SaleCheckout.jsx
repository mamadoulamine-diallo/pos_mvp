import { useState } from "react";
import { CreditCard, Smartphone, Wallet, X } from "lucide-react";

import "./SaleCheckout.scss";

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString("fr-FR")} F`;
}

const paymentMethods = [
  {
    value: "cash",
    label: "Espèces",
    icon: Wallet,
  },
  {
    value: "mobile",
    label: "Mobile Money",
    icon: Smartphone,
  },
  {
    value: "card",
    label: "Carte",
    icon: CreditCard,
  },
];

function SaleCheckout({
  open,
  total,
  submitting,
  error,
  onClose,
  onConfirm,
}) {
  const [paymentMethod, setPaymentMethod] =
    useState("cash");

  if (!open) {
    return null;
  }

  async function handleConfirm() {
    await onConfirm(paymentMethod);
  }

  return (
    <div className="SaleCheckout">
      <button
        type="button"
        className="SaleCheckout-backdrop"
        aria-label="Fermer"
        onClick={onClose}
      />

      <section
        className="SaleCheckout-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sale-checkout-title"
      >
        <header className="SaleCheckout-header">
          <div>
            <span className="SaleCheckout-eyebrow">
              Finalisation
            </span>

            <h2 id="sale-checkout-title">
              Finaliser la vente
            </h2>
          </div>

          <button
            type="button"
            className="SaleCheckout-close"
            aria-label="Fermer"
            disabled={submitting}
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="SaleCheckout-total">
          <span>Total à payer</span>

          <strong>
            {formatPrice(total)}
          </strong>
        </div>

        <div className="SaleCheckout-payment">
          <span className="SaleCheckout-label">
            Mode de paiement
          </span>

          <div className="SaleCheckout-methods">
            {paymentMethods.map((method) => {
              const Icon = method.icon;

              return (
                <button
                  key={method.value}
                  type="button"
                  className={
                    paymentMethod === method.value
                      ? "SaleCheckout-method active"
                      : "SaleCheckout-method"
                  }
                  disabled={submitting}
                  onClick={() =>
                    setPaymentMethod(method.value)
                  }
                >
                  <Icon
                    size={20}
                    aria-hidden="true"
                  />

                  <span>{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="SaleCheckout-error">
            {error}
          </p>
        )}

        <footer className="SaleCheckout-actions">
          <button
            type="button"
            className="SaleCheckout-cancel"
            disabled={submitting}
            onClick={onClose}
          >
            Annuler
          </button>

          <button
            type="button"
            className="SaleCheckout-confirm"
            disabled={submitting}
            onClick={handleConfirm}
          >
            {submitting
              ? "Enregistrement..."
              : "Confirmer la vente"}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default SaleCheckout;