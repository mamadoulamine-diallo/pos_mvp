import {
  getUserRoles,
  getUsers,
  postUser,
  putUser,
} from "../api/userApi";

export async function loadUsers() {
  return getUsers();
}

export async function loadUserRoles() {
  return getUserRoles();
}

export async function createUser(data) {
  return postUser(data);
}

export async function updateUser(
  id,
  data,
) {
  return putUser(id, data);
}