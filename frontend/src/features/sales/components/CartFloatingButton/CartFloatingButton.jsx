import { ShoppingCart } from "lucide-react";

import "./CartFloatingButton.scss";

function CartFloatingButton({
  quantity,
  onClick,
}) {
  return (
    <button
      type="button"
      className="CartFloatingButton"
      aria-label="Ouvrir le panier"
      onClick={onClick}
    >
      <ShoppingCart
        size={22}
        aria-hidden="true"
      />

      {quantity > 0 && (
        <span className="CartFloatingButton-count">
          {quantity}
        </span>
      )}
    </button>
  );
}

export default CartFloatingButton;