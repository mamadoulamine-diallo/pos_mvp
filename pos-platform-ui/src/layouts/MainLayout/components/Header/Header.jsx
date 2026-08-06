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
        <UserMenu />
      </div>
    </header>
  );
}

export default Header;