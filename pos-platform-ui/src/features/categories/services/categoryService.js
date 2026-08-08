import { getCategories } from "../api/categoryApi";

export async function loadCategories() {
  return getCategories();
}