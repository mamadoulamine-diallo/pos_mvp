import { useState } from "react";

import PeriodFilter from "../components/PeriodFilter";
import SummaryCards from "../widgets/SummaryCards";
import RevenueChart from "../widgets/RevenueChart";
import TopProducts from "../widgets/TopProducts";
import RecentSales from "../widgets/RecentSales";
import StockAlerts from "../widgets/StockAlerts";
import QuickActions from "../widgets/QuickActions";
import DashboardHero from "../widgets/DashboardHero";
import "./DashboardPage.scss";

function DashboardPage() {
  const [period, setPeriod] = useState("TODAY");

  return (
    <main className="Dashboard">
        <DashboardHero />

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
         <QuickActions />
      </section>
    </main>
  );
}

export default DashboardPage;