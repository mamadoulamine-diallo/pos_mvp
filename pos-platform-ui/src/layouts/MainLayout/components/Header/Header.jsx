import { Calculator } from "lucide-react";

import NotificationMenu from "./NotificationMenu";
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

        <NotificationMenu />

        <UserMenu />
      </div>
    </header>
  );
}

export default Header;