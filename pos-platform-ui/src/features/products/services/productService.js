import {
  createProduct as createProductRequest,
  getProducts,
  updateProduct as updateProductRequest,
} from "../api/productApi";

export async function loadProducts() {
  return getProducts();
}

export async function createProduct(data) {
  return createProductRequest(data);
}

export async function updateProduct(id, data) {
  return updateProductRequest(id, data);
}