import SaleCartItem from "../SaleCartItem";

import "./SaleCart.scss";

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString("fr-FR")} F`;
}

function SaleCart({
  items,
  quantity,
  total,
  open,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onValidate,
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          className="SaleCart-backdrop"
          aria-label="Fermer le panier"
          onClick={onClose}
        />
      )}

      <aside className={open ? "SaleCart open" : "SaleCart"}>
        <header className="SaleCart-header">
          <h2>Panier</h2>

          <span>
            {quantity} {quantity === 1 ? "article" : "articles"}
          </span>
        </header>

        <div className="SaleCart-items">
          {items.length === 0 ? (
            <p className="SaleCart-empty">
              Votre panier est vide.
            </p>
          ) : (
            items.map((item) => (
              <SaleCartItem
                key={item.id}
                item={item}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
              />
            ))
          )}
        </div>

        <footer className="SaleCart-footer">
          <div className="SaleCart-total">
            <span>Total</span>

            <strong>
              {formatPrice(total)}
            </strong>
          </div>

          <button
            type="button"
            className="SaleCart-validate"
            disabled={items.length === 0}
            onClick={onValidate}
          >
            Valider
          </button>

          <button
            type="button"
            className="SaleCart-cancel"
            disabled={items.length === 0}
            onClick={onClear}
          >
            Annuler
          </button>
        </footer>
      </aside>
    </>
  );
}

export default SaleCart;