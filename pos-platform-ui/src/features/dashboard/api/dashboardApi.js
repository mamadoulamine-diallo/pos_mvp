import axiosClient from "../../../shared/api/axiosClient";

export async function getDashboardSummary(period = "TODAY") {
  const response = await axiosClient.get("/dashboard/summary", {
    params: { period },
  });

  return response.data;
}