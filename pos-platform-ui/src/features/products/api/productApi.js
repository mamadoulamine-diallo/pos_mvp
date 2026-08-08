import axiosClient from "../../../shared/api/axiosClient";

export async function getProducts() {
  const response = await axiosClient.get("/products");

  return response.data;
}