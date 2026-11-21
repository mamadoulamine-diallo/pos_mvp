import { ChevronRight } from "lucide-react";

import "./SaleHistoryRow.scss";

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString("fr-FR")} F`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function SaleHistoryRow({
  sale,
  onSelect,
}) {
  return (
    <button
      type="button"
      className="SaleHistoryRow"
      onClick={() => onSelect(sale.saleId)}
    >
      <div className="SaleHistoryRow-main">
        <strong>
          Vente #{sale.saleId}
        </strong>

        <span>
          {formatDate(sale.saleDate)}
        </span>
      </div>

      <div className="SaleHistoryRow-user">
        <strong>
          {sale.userName}
        </strong>

        <span>
          {sale.userRole}
        </span>
      </div>

      <span className="SaleHistoryRow-count">
        {sale.itemCount}{" "}
        {sale.itemCount === 1
          ? "article"
          : "articles"}
      </span>

      <strong className="SaleHistoryRow-total">
        {formatPrice(sale.total)}
      </strong>

      <ChevronRight
        className="SaleHistoryRow-arrow"
        size={18}
        aria-hidden="true"
      />
    </button>
  );
}

export default SaleHistoryRow;