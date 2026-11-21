import {
  createCategory as createCategoryRequest,
  getCategories,
  updateCategory as updateCategoryRequest,
} from "../api/categoryApi";

export async function loadCategories() {
  return getCategories();
}

export async function createCategory(data) {
  return createCategoryRequest(data);
}

export async function updateCategory(id, data) {
  return updateCategoryRequest(id, data);
}