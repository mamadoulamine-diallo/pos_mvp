import {
  getDashboardSummary,
  getLowStockCount,
  getOutOfStockCount,
  getRevenueByDay,
  getRevenueByMonth,
  getRevenueByYear,
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

export async function loadRevenueChart(
  view = "day",
  period = "TODAY",
) {
  const loaders = {
    day: getRevenueByDay,
    month: getRevenueByMonth,
    year: getRevenueByYear,
  };

  const loader = loaders[view] ?? loaders.day;
  const data = await loader(period);

  return view === "day" ? data.slice(-14) : data;
}