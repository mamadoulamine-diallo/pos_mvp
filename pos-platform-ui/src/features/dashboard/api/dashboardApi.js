import axiosClient from "../../../shared/api/axiosClient";

export async function getDashboardSummary(period = "TODAY") {
  const response = await axiosClient.get("/dashboard/summary", {
    params: { period },
  });

  return response.data;
}

export async function getLowStockCount() {
  const response = await axiosClient.get(
    "/dashboard/stock-alerts/low-count"
  );

  return response.data;
}

export async function getOutOfStockCount() {
  const response = await axiosClient.get(
    "/dashboard/stock-alerts/out-count"
  );

  return response.data;
}