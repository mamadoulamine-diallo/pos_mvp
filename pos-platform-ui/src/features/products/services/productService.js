import {
  addProductStock,
  createProduct as createProductRequest,
  getProducts,
  changeProductPrice,
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

export async function addStock(data) {
  await addProductStock(data);
}

export async function changePrice(data) {
  await changeProductPrice(data);
}