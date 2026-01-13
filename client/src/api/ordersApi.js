import { http } from "./http";

export async function getMyOrders() {
  const { data } = await http.get("/orders/mine");
  return data; // array
}

export async function getAllOrders() {
  const { data } = await http.get("/orders");
  return data; // array (admin)
}

export async function updateOrderStatus(orderId, status) {
  const { data } = await http.patch(`/orders/${orderId}/status`, { status });
  return data;
}

export async function createOrder(payload) {
  // payload: { paymentMethod?: "card" | "paypal" | "bit" | "phone", notes?: string }
  const { data } = await http.post("/orders", payload);
  return data;
}
