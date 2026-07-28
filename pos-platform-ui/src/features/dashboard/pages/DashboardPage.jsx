import { useState } from "react";
import PeriodFilter from "../components/PeriodFilter";
import SummaryCards from "../widgets/SummaryCards";

function DashboardPage() {
  const [period, setPeriod] = useState("TODAY");

  return (
    <main className="Dashboard">
      <PeriodFilter period={period} onChange={setPeriod} />
      <SummaryCards period={period} />
    </main>
  );
}

export default DashboardPage;