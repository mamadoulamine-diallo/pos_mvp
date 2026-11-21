import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./components/Header";
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
        String(nextValue),
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
      <Header />

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