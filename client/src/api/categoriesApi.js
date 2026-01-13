import { http } from "./http";

export async function getAllCategories() {
  const { data } = await http.get("/categories");
  return data;
}

export async function createCategory(payload) {
  const { data } = await http.post("/categories", payload);
  return data;
}

export async function updateCategory(id, payload) {
  const { data } = await http.put(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id) {
  const { data } = await http.delete(`/categories/${id}`);
  return data;
}
