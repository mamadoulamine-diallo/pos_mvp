import { useState } from "react";
import PeriodFilter from "../components/PeriodFilter";
import RevenueChart from "../widgets/RevenueChart";
import SummaryCards from "../widgets/SummaryCards";

function DashboardPage() {
  const [period, setPeriod] = useState("TODAY");

  return (
    <main className="Dashboard">
      <PeriodFilter period={period} onChange={setPeriod} />

      <SummaryCards period={period} />

      <section className="Dashboard-grid">
        <RevenueChart period={period} />
      </section>
    </main>
  );
}

export default DashboardPage;