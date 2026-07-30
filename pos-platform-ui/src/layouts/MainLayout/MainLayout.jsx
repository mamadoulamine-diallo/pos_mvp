import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import "./MainLayout.scss";

function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  function toggleSidebar() {
    setSidebarCollapsed((currentValue) => {
      const nextValue = !currentValue;

      localStorage.setItem(
        "sidebarCollapsed",
        String(nextValue)
      );

      return nextValue;
    });
  }

  return (
    <div
      className={
        sidebarCollapsed
          ? "MainLayout MainLayout--sidebarCollapsed"
          : "MainLayout"
      }
    >
      <header className="MainLayout-header">
        <span className="MainLayout-brand">
          POS Platform
        </span>
      </header>

      <div className="MainLayout-body">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />

        <main className="MainLayout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;