import {
  addProductStock,
  changeProductPrice,
  createProduct as createProductRequest,
  getProduct,
  getProductPriceHistory,
  getProductPricing,
  getProducts,
  updateProduct as updateProductRequest,
} from "../api/productApi";

export async function loadProducts() {
  return getProducts();
}

export async function loadProduct(id) {
  return getProduct(id);
}

export async function loadProductPricing(id) {
  return getProductPricing(id);
}

export async function loadProductPriceHistory(id) {
  return getProductPriceHistory(id);
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