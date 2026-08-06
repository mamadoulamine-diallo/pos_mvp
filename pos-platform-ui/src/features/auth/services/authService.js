import {
  getCurrentUser,
  logoutCurrentUser,
} from "../api/authApi";

export async function loadCurrentUser() {
  const response = await getCurrentUser();

  return response.data;
}

export async function logoutUser() {
  await logoutCurrentUser();
}