import { useState } from "react";

import PeriodFilter from "../components/PeriodFilter";
import SummaryCards from "../widgets/SummaryCards";
import RevenueChart from "../widgets/RevenueChart";
import TopProducts from "../widgets/TopProducts";
import RecentSales from "../widgets/RecentSales";
import StockAlerts from "../widgets/StockAlerts";
import "./DashboardPage.scss";

function DashboardPage() {
  const [period, setPeriod] = useState("TODAY");

  return (
    <main className="Dashboard">
      <PeriodFilter
        period={period}
        onChange={setPeriod}
      />

      <SummaryCards period={period} />

      <section className="Dashboard-grid">
        <RevenueChart period={period} />
        <TopProducts period={period} />
        <RecentSales period={period} />
         <StockAlerts />
      </section>
    </main>
  );
}

export default DashboardPage;