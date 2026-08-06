import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { loadNotifications } from "../../../../features/notifications/services/notificationsService";

function NotificationMenu() {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchNotifications() {
      try {
        const data = await loadNotifications();

        if (!cancelled) {
          setNotifications(data);
          setError(null);
        }
      } catch (requestError) {
        console.error(
          "Impossible de charger les notifications.",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Impossible de charger les notifications.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

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

  function handleNotificationClick(productId) {
    setOpen(false);

    navigate(`/products?productId=${productId}`);
  }

  const notificationCount = notifications.length;

  return (
    <div
      className="NotificationMenu"
      ref={menuRef}
    >
      <button
        type="button"
        className="Header-actionButton"
        aria-label="Afficher les notifications"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Notifications"
        onClick={() => setOpen((current) => !current)}
      >
        <Bell size={20} aria-hidden="true" />

        {notificationCount > 0 && (
          <span
            className="Header-notificationBadge"
            aria-label={`${notificationCount} notification(s)`}
          >
            {notificationCount > 99
              ? "99+"
              : notificationCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="NotificationMenu-dropdown"
          role="menu"
        >
          <header className="NotificationMenu-header">
            <div>
              <strong>Notifications</strong>
              <span>
                {notificationCount} alerte(s)
              </span>
            </div>
          </header>

          <div className="NotificationMenu-content">
            {loading && (
              <p className="NotificationMenu-message">
                Chargement...
              </p>
            )}

            {error && (
              <p className="NotificationMenu-message NotificationMenu-message--error">
                {error}
              </p>
            )}

            {!loading &&
              !error &&
              notifications.length === 0 && (
                <p className="NotificationMenu-message">
                  Aucune notification.
                </p>
              )}

            {!loading &&
              !error &&
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  role="menuitem"
                  className={`NotificationMenu-item NotificationMenu-item--${notification.level}`}
                  onClick={() =>
                    handleNotificationClick(
                      notification.productId,
                    )
                  }
                >
                  <span className="NotificationMenu-indicator" />

                  <span className="NotificationMenu-info">
                    <strong>
                      {notification.title}
                    </strong>

                    <small>
                      {notification.message}
                    </small>
                  </span>
                </button>
              ))}
          </div>

          {notificationCount > 0 && (
            <footer className="NotificationMenu-footer">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate("/products");
                }}
              >
                Voir tous les produits
              </button>
            </footer>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationMenu;