import { X } from "lucide-react";

import "./SaleDetailModal.scss";

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString("fr-FR")} F`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function SaleDetailModal({
  sale,
  loading,
  error,
  onClose,
}) {
  if (!sale && !loading && !error) {
    return null;
  }

  return (
    <div className="SaleDetailModal">
      <button
        type="button"
        className="SaleDetailModal-backdrop"
        aria-label="Fermer"
        onClick={onClose}
      />

      <section
        className="SaleDetailModal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sale-detail-title"
      >
        <header className="SaleDetailModal-header">
          <div>
            <span>
              Détail de la vente
            </span>

            <h2 id="sale-detail-title">
              {sale
                ? `Vente #${sale.saleId}`
                : "Chargement..."}
            </h2>
          </div>

          <button
            type="button"
            className="SaleDetailModal-close"
            aria-label="Fermer"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {loading && (
          <p className="SaleDetailModal-message">
            Chargement du détail...
          </p>
        )}

        {error && (
          <p className="SaleDetailModal-message SaleDetailModal-message--error">
            {error}
          </p>
        )}

        {sale && !loading && (
          <>
            <div className="SaleDetailModal-meta">
              <div>
                <span>Date</span>
                <strong>
                  {formatDate(sale.saleDate)}
                </strong>
              </div>

              <div>
                <span>Vendeur</span>
                <strong>
                  {sale.userName}
                </strong>
              </div>

              <div>
                <span>Rôle</span>
                <strong>
                  {sale.userRole}
                </strong>
              </div>

              <div>
                <span>Statut</span>
                <strong>
                  {sale.status}
                </strong>
              </div>
            </div>

            <div className="SaleDetailModal-items">
              {sale.items.map((item, index) => (
                <div
                  key={`${item.productName}-${index}`}
                  className="SaleDetailModal-item"
                >
                  <div>
                    <strong>
                      {item.productName}
                    </strong>

                    <span>
                      {item.quantity} ×{" "}
                      {formatPrice(item.unitPrice)}
                    </span>
                  </div>

                  <strong>
                    {formatPrice(item.lineTotal)}
                  </strong>
                </div>
              ))}
            </div>

            <footer className="SaleDetailModal-footer">
              <div>
                <span>
                  {sale.itemCount}{" "}
                  {sale.itemCount === 1
                    ? "article"
                    : "articles"}
                </span>

                <strong>
                  Total
                </strong>
              </div>

              <strong className="SaleDetailModal-total">
                {formatPrice(sale.total)}
              </strong>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}

export default SaleDetailModal;