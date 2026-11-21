import {
  getCurrentUser,
  postLogin,
  postLogout,
} from "../api/authApi";

export async function login(pinCode) {
  return postLogin(pinCode);
}

export async function loadCurrentUser() {
  return getCurrentUser();
}

export async function logout() {
  return postLogout();
}