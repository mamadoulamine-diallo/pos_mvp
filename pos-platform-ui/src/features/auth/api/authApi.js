import axiosClient from "../../../shared/api/axiosClient";

export function getCurrentUser() {
  return axiosClient.get("/auth/me");
}

export function logoutCurrentUser() {
  return axiosClient.post("/auth/logout");
}