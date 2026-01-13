import { http } from "./http";

export async function getProductById(id) {
  const { data } = await http.get(`/products/${id}`);
  return data;
}

export async function getAllProducts() {
  const { data } = await http.get("/products");
  return data;
}

// Admin CRUD (minimal)
export async function createProduct(payload) {
  const { data } = await http.post("/products", payload);
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await http.put(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await http.delete(`/products/${id}`);
  return data;
}
