import axiosClient from "../../../shared/api/axiosClient";

export async function getStockNotifications() {
  const response = await axiosClient.get(
    "/dashboard/stock-alerts",
  );

  return response.data;
}