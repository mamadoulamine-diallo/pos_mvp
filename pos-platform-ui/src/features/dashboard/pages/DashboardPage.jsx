import { useState } from "react";
import SummaryCards from "../widgets/SummaryCards";

function DashboardPage() {
  const [period] = useState("TODAY");

  return <SummaryCards period={period} />;
}

export default DashboardPage;