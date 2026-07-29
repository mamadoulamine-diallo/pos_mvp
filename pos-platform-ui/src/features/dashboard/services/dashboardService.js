import {
  getDashboardSummary,
  getLowStockCount,
  getOutOfStockCount,
  getRecentSales,
  getRevenueByDay,
  getRevenueByMonth,
  getRevenueByYear,
  getTopProducts,
  getStockAlerts,
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

export async function loadTopProducts(period = "TODAY") {
    return await getTopProducts(period);
}

export async function loadRecentSales(period = "TODAY") {
  return getRecentSales(period);
}

export async function loadStockAlerts() {
  return getStockAlerts();
}