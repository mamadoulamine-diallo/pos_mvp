import { ListFilter, X } from "lucide-react";
import { useState } from "react";

import "./ProductStatusFilter.scss";

const filters = [
  {
    value: "all",
    label: "Tous",
    icon: "⚪",
  },
  {
    value: "in-stock",
    label: "En stock",
    icon: "🟢",
  },
  {
    value: "low-stock",
    label: "Stock faible",
    icon: "🟠",
  },
  {
    value: "out-stock",
    label: "Rupture",
    icon: "🔴",
  },
  {
    value: "inactive",
    label: "Inactifs",
    icon: "⚫",
  },
];

function ProductStatusFilter({
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const activeFilter =
    filters.find(
      (filter) => filter.value === value,
    ) ?? filters[0];

  function handleFilterChange(filterValue) {
    onChange(filterValue);
    setOpen(false);
  }

  return (
    <div
      className={
        open
          ? "ProductStatusFilter open"
          : "ProductStatusFilter"
      }
    >
      {/* Mobile / tablette */}

      <button
        className="ProductStatusFilter-opener"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <X size={20} aria-hidden="true" />
        ) : (
          <ListFilter
            size={20}
            aria-hidden="true"
          />
        )}

        <span>État</span>

        {value !== "all" && (
          <span className="ProductStatusFilter-opener-active">
            {activeFilter.icon}
          </span>
        )}
      </button>

      {/* Backdrop mobile / tablette */}

      {open && (
        <button
          className="ProductStatusFilter-backdrop"
          type="button"
          aria-label="Fermer les filtres"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Filtres */}

      <div className="ProductStatusFilter-content">
        <div className="ProductStatusFilter-title">
          <ListFilter
            size={18}
            aria-hidden="true"
          />

          <span>État</span>
        </div>

        <div className="ProductStatusFilter-list">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={
                value === filter.value
                  ? "ProductStatusFilter-button active"
                  : "ProductStatusFilter-button"
              }
              onClick={() =>
                handleFilterChange(filter.value)
              }
            >
              <span className="ProductStatusFilter-icon">
                {filter.icon}
              </span>

              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductStatusFilter;