import { getDashboardSummary } from "../api/dashboardApi";

export async function loadDashboardSummary(period = "TODAY") {
    return await getDashboardSummary(period);
}