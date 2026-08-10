import {
  createProduct as createProductRequest,
  getProducts,
} from "../api/productApi";

export async function loadProducts() {
  return getProducts();
}

export async function createProduct(data) {
  return createProductRequest(data);
}