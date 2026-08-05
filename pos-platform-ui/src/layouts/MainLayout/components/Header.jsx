function Header() {
  return (
    <header className="Header">
      <div className="Header-brand">
        <span className="Header-logo" aria-hidden="true">
          POS
        </span>

        <span className="Header-brandName">
          POS Platform
        </span>
      </div>

      <div className="Header-actions">
        <div className="Header-userInfo">
          <span className="Header-userName">
            Lamine Diallo
          </span>

          <span className="Header-userRole">
            Gérant
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;