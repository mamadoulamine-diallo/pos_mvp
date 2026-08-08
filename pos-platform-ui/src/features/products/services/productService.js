import { getProducts } from "../api/productApi";

export async function loadProducts() {
  return getProducts();
}