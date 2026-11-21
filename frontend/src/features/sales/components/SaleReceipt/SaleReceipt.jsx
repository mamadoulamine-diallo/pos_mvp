import { CheckCircle2, Printer, X } from "lucide-react";

import "./SaleReceipt.scss";

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString("fr-FR")} F`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getPaymentLabel(method) {
  switch (method) {
    case "mobile":
      return "Mobile Money";

    case "card":
      return "Carte";

    case "cash":
    default:
      return "Espèces";
  }
}

function SaleReceipt({
  sale,
  onClose,
}) {
  if (!sale) {
    return null;
  }

  return (
    <div className="SaleReceipt">
      <div className="SaleReceipt-backdrop" />

      <section
        className="SaleReceipt-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sale-receipt-title"
      >
        <header className="SaleReceipt-header">
          <div className="SaleReceipt-success">
            <CheckCircle2
              size={28}
              aria-hidden="true"
            />

            <div>
              <span>Vente enregistrée</span>

              <h2 id="sale-receipt-title">
                Reçu #{sale.id}
              </h2>
            </div>
          </div>

          <button
            type="button"
            className="SaleReceipt-close"
            aria-label="Fermer le reçu"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="SaleReceipt-meta">
          <span>Date</span>

          <strong>
            {formatDate(sale.date)}
          </strong>
        </div>

        <div className="SaleReceipt-items">
          {sale.items.map((item) => (
            <div
              key={item.id}
              className="SaleReceipt-item"
            >
              <div className="SaleReceipt-itemInfo">
                <strong>{item.name}</strong>

                <span>
                  {item.quantity} ×{" "}
                  {formatPrice(item.price)}
                </span>
              </div>

              <strong className="SaleReceipt-itemTotal">
                {formatPrice(
                  item.price * item.quantity,
                )}
              </strong>
            </div>
          ))}
        </div>

        <div className="SaleReceipt-payment">
          <span>Mode de paiement</span>

          <strong>
            {getPaymentLabel(
              sale.paymentMethod,
            )}
          </strong>
        </div>

        <div className="SaleReceipt-total">
          <span>Total payé</span>

          <strong>
            {formatPrice(sale.total)}
          </strong>
        </div>

        <footer className="SaleReceipt-actions">
          <button
            type="button"
            className="SaleReceipt-print"
            onClick={() => window.print()}
          >
            <Printer
              size={18}
              aria-hidden="true"
            />

            Imprimer
          </button>

          <button
            type="button"
            className="SaleReceipt-newSale"
            onClick={onClose}
          >
            Nouvelle vente
          </button>
        </footer>
      </section>
    </div>
  );
}

export default SaleReceipt;