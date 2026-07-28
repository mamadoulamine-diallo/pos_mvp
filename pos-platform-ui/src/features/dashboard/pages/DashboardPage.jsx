import { useEffect } from "react";
import { getDashboardSummary } from "../api/dashboardApi";

function DashboardPage() {
  useEffect(() => {
    getDashboardSummary()
      .then((data) => console.log("Dashboard summary:", data))
      .catch((error) => console.error("Dashboard API error:", error));
  }, []);

  return <h1>Dashboard</h1>;
}

export default DashboardPage;