import {
  getDashboardSummary,
  getLowStockCount,
  getOutOfStockCount,
} from "../api/dashboardApi";

export async function loadDashboardSummary(period = "TODAY") {
  const [summary, lowStockCount, outOfStockCount] = await Promise.all([
    getDashboardSummary(period),
    getLowStockCount(),
    getOutOfStockCount(),
  ]);

  return {
    ...summary,
    lowStockCount,
    outOfStockCount,
  };
}