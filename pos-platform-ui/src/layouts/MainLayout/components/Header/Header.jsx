import useAuth from "../../../../features/auth/hooks/useAuth";

function Header() {
  const {
    currentUser,
    loading,
  } = useAuth();

  const userName = loading
    ? "Chargement..."
    : currentUser?.fullName ?? "Utilisateur";

  const userRole = currentUser?.role ?? "";

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
        <div className="Header-userInfo">
          <span className="Header-userName">
            {userName}
          </span>

          {userRole && (
            <span className="Header-userRole">
              {userRole === "GERANT"
                ? "Gérant"
                : "Vendeur"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;