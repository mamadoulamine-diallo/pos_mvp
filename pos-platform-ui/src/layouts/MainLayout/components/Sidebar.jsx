import {
  ChartNoAxesCombined,
  FolderTree,
  Package,
  ReceiptText,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: ChartNoAxesCombined,
    end: true,
  },
  {
    label: "Products",
    path: "/products",
    icon: Package,
  },
  {
    label: "Categories",
    path: "/categories",
    icon: FolderTree,
  },
  {
    label: "Sales",
    path: "/sales",
    icon: ReceiptText,
  },
  {
    label: "Users",
    path: "/users",
    icon: Users,
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav aria-label="Main navigation">
        <ul className="sidebar__list">
          {menuItems.map(({ label, path, icon: Icon, end }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={end}
                className={({ isActive }) =>
                  `sidebar__link${isActive ? " sidebar__link--active" : ""}`
                }
              >
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;