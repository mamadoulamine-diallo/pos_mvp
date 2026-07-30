import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: "⌂",
    end: true,
  },
  {
    label: "Nouvelle vente",
    path: "/sales/new",
    icon: "+",
  },
  {
    label: "Produits",
    path: "/products",
    icon: "▣",
  },
  {
    label: "Catégories",
    path: "/categories",
    icon: "▤",
  },
  {
    label: "Ventes",
    path: "/sales",
    icon: "€",
  },
  {
    label: "Utilisateurs",
    path: "/users",
    icon: "♙",
  },
];

function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`Sidebar ${
        collapsed ? "Sidebar--collapsed" : ""
      }`}
    >
      <nav
        className="Sidebar-nav"
        aria-label="Navigation principale"
      >
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            title={collapsed ? item.label : undefined}
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
              {item.icon}
            </span>

            <span className="Sidebar-label">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="Sidebar-footer">
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
          <span aria-hidden="true">
            {collapsed ? "›" : "‹"}
          </span>

          <span className="Sidebar-toggleLabel">
            Réduire
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;