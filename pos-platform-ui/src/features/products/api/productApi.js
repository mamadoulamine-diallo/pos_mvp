import axiosClient from "../../../shared/api/axiosClient";

export async function getProducts() {
  const response = await axiosClient.get("/products");

  return response.data;
}

export async function createProduct(request) {
  const response = await axiosClient.post(
    "/products",
    request,
  );

  return response.data;
}

export async function updateProduct(id, request) {
  const response = await axiosClient.put(
    `/products/${id}`,
    request,
  );

  return response.data;
}

export async function addProductStock(request) {
  await axiosClient.post("/products/stock", request);
}

export async function changeProductPrice(request) {
  await axiosClient.post("/products/price", request);
}