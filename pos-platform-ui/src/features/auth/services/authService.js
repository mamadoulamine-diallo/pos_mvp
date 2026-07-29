import { getCurrentUser } from "../api/authApi";

export async function loadCurrentUser() {
  const response = await getCurrentUser();

  return response.data;
}