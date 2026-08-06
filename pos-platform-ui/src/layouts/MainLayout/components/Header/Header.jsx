import {
  Bell,
  Calculator,
} from "lucide-react";

import UserMenu from "./UserMenu";

function Header() {
  return (
    <header className="Header">
      <div className="Header-brand">
        <span
          className="Header-logo"
          aria-hidden="true"
        >
          POS
        </span>

        <span className="Header-brandName">
          POS Platform
        </span>
      </div>

      <div className="Header-actions">
        <button
          type="button"
          className="Header-actionButton"
          aria-label="Ouvrir la calculatrice"
          title="Calculatrice"
        >
          <Calculator size={20} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="Header-actionButton"
          aria-label="Afficher les notifications"
          title="Notifications"
        >
          <Bell size={20} aria-hidden="true" />
        </button>

        <UserMenu />
      </div>
    </header>
  );
}

export default Header;