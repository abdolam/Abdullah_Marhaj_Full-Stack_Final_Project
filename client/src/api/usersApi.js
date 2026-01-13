import { http } from "./http";

export async function registerUser(payload) {
  const { data } = await http.post("/users", payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await http.post("/users/login", payload);
  return data; // expected: { token, user }
}

// Forgot Password
export async function forgotPassword(payload) {
  // payload: { email }
  const { data } = await http.post("/users/forgot-password", payload);
  return data; // expected: { message } (server might return 204 as well)
}

export async function resetPassword(payload) {
  // payload: { token, newPassword }
  const { data } = await http.post("/users/reset-password", payload);
  return data; // expected: { message } (server might return 204 as well)
}

// Minimal "profile" read (JWT does not include email)
export async function getUserById(id) {
  const { data } = await http.get(`/users/${id}`);
  return data; // expected: user public fields
}

// Admin: list users (minimal)
export async function listUsers(params = {}) {
  const { data } = await http.get("/users", { params });
  return data; // expected: list payload (array or { items, ... })
}
