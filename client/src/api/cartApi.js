import { http } from "./http";

export async function addToCart(productId, quantity) {
  const { data } = await http.post("/cart/add", { productId, quantity });
  return data; // { message, cart }
}

export async function getCartSummary() {
  const { data } = await http.get("/cart/summary");
  return data; // { items, subtotal, total }
}

export async function getCart() {
  const { data } = await http.get("/cart");
  return data; // cart document
}

export async function updateCartItem(productId, quantity) {
  const { data } = await http.put(`/cart/update/${productId}`, { quantity });
  return data; // { message, cart }
}

export async function removeCartItem(productId) {
  const { data } = await http.delete(`/cart/remove/${productId}`);
  return data; // { message, cart }
}

export async function clearCart() {
  const { data } = await http.delete("/cart/clear");
  return data; // { message, cart }
}
