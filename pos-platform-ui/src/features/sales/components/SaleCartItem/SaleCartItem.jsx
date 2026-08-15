import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import "./SaleCartItem.scss";

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString("fr-FR")} F`;
}

function SaleCartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const lineTotal =
    item.price * item.quantity;

  return (
    <article className="SaleCartItem">
      <div className="SaleCartItem-top">
        <div className="SaleCartItem-info">
          <strong className="SaleCartItem-name">
            {item.name}
          </strong>

          <span className="SaleCartItem-unitPrice">
            {formatPrice(item.price)} / unité
          </span>
        </div>

        <button
          type="button"
          className="SaleCartItem-remove"
          aria-label={`Supprimer ${item.name}`}
          onClick={() => onRemove(item.id)}
        >
          <Trash2
            size={28}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="SaleCartItem-bottom">
        <div className="SaleCartItem-controls">
          <button
            type="button"
            aria-label={`Diminuer la quantité de ${item.name}`}
            onClick={() => onDecrease(item.id)}
          >
            <Minus
              size={16}
              aria-hidden="true"
            />
          </button>

          <span className="SaleCartItem-quantity">
            {item.quantity}
          </span>

          <button
            type="button"
            aria-label={`Augmenter la quantité de ${item.name}`}
            disabled={
              item.quantity >=
              item.stockQuantity
            }
            onClick={() => onIncrease(item.id)}
          >
            <Plus
              size={16}
              aria-hidden="true"
            />
          </button>
        </div>

        <strong className="SaleCartItem-total">
          {formatPrice(lineTotal)}
        </strong>
      </div>
    </article>
  );
}

export default SaleCartItem;