import axiosClient from "../../../shared/api/axiosClient";

export async function getCategories() {
  const response = await axiosClient.get("/categories");

  return response.data;
}