import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users } from "lucide-react";

import useAuth from "../../../../features/auth/hooks/useAuth";

function getInitials(fullName) {
  if (!fullName) {
    return "U";
  }

  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatRole(role) {
  if (role === "GERANT") {
    return "Gérant";
  }

  if (role === "VENDEUR") {
    return "Vendeur";
  }

  return role ?? "";
}

function UserMenu() {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const {
    user,
    loading,
    logout,
  } = useAuth();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await logout();

      setOpen(false);

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Échec de la déconnexion.",
        error,
      );
    } finally {
      setLoggingOut(false);
    }
  }

  const fullName = loading
    ? "Chargement..."
    : (user?.fullName ?? "Utilisateur");

  const roleLabel =
    formatRole(user?.role);

  const initials =
    getInitials(user?.fullName);

  return (
    <div
      className="UserMenu"
      ref={menuRef}
    >
      <button
        type="button"
        className="Header-userButton"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() =>
          setOpen((current) => !current)
        }
      >
        <span
          className="Header-userAvatar"
          aria-hidden="true"
        >
          {initials}
        </span>

        <span className="Header-userInfo">
          <span className="Header-userName">
            {fullName}
          </span>

          {roleLabel && (
            <span className="Header-userRole">
              {roleLabel}
            </span>
          )}
        </span>

        <span
          className="Header-userChevron"
          aria-hidden="true"
        >
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <div
          className="UserMenu-dropdown"
          role="menu"
        >
          <div className="UserMenu-summary">
            <strong>{fullName}</strong>

            {roleLabel && (
              <span>{roleLabel}</span>
            )}
          </div>

          <div className="UserMenu-separator" />

          <button
            type="button"
            className="UserMenu-item"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              navigate("/users");
            }}
          >
            <Users
              size={18}
              aria-hidden="true"
            />

            <span>
              Gérer les utilisateurs
            </span>
          </button>

          <div className="UserMenu-separator" />

          <button
            type="button"
            className="UserMenu-item UserMenu-item--danger"
            role="menuitem"
            disabled={loggingOut}
            onClick={handleLogout}
          >
            <LogOut
              size={18}
              aria-hidden="true"
            />

            <span>
              {loggingOut
                ? "Déconnexion..."
                : "Déconnexion"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;