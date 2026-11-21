import {
  LayoutDashboard,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  ShoppingCart,
  Tags,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Caisse",
    path: "/sales/new",
    icon: ShoppingCart,
  },
  {
    label: "Produits",
    path: "/products",
    icon: Package,
  },
  {
    label: "Catégories",
    path: "/categories",
    icon: Tags,
  },
  {
    label: "Historique des ventes",
    path: "/sales/history",
    icon: ReceiptText,
  },
  {
    label: "Utilisateurs",
    path: "/users",
    icon: Users,
  },
];

function Sidebar({ collapsed, onToggle }) {
  const ToggleIcon = collapsed
    ? PanelLeftOpen
    : PanelLeftClose;

  return (
    <aside
      className={
        collapsed
          ? "Sidebar Sidebar--collapsed"
          : "Sidebar"
      }
    >
      <nav
        className="Sidebar-nav"
        aria-label="Navigation principale"
      >
        {navigationItems.map(
          ({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                isActive
                  ? "Sidebar-link Sidebar-link--active"
                  : "Sidebar-link"
              }
            >
              <span
                className="Sidebar-icon"
                aria-hidden="true"
              >
                <Icon size={20} strokeWidth={2} />
              </span>

              <span className="Sidebar-label">
                {label}
              </span>
            </NavLink>
          ),
        )}
      </nav>

      <footer className="Sidebar-footer">
        <button
          type="button"
          className="Sidebar-toggle"
          onClick={onToggle}
          aria-label={
            collapsed
              ? "Déployer la navigation"
              : "Réduire la navigation"
          }
          aria-expanded={!collapsed}
        >
          <span
            className="Sidebar-icon"
            aria-hidden="true"
          >
            <ToggleIcon size={20} strokeWidth={2} />
          </span>

          <span className="Sidebar-toggleLabel">
            Réduire
          </span>
        </button>
      </footer>
    </aside>
  );
}

export default Sidebar;