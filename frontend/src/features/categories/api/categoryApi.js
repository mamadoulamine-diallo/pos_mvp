import axiosClient from "../../../shared/api/axiosClient";

export async function getCategories() {
  const response = await axiosClient.get("/categories");

  return response.data;
}

export async function createCategory(request) {
  const response = await axiosClient.post(
    "/categories",
    request,
  );

  return response.data;
}

export async function updateCategory(id, request) {
  const response = await axiosClient.put(
    `/categories/${id}`,
    request,
  );

  return response.data;
}