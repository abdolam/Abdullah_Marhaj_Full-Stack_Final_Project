import axios from "axios";

import { getToken } from "../auth/authStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const http = axios.create({
  baseURL,
  withCredentials: false,
});

function emitAuthInvalid(detail) {
  try {
    window.dispatchEvent(new CustomEvent("ecostore_auth_invalid", { detail }));
  } catch {
    // no-op
  }
}

function emitRateLimited(detail) {
  try {
    window.dispatchEvent(new CustomEvent("ecostore_rate_limited", { detail }));
  } catch {
    // no-op
  }
}

// Attach JWT to every request
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = String(err?.config?.url || "");

    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error?.message ||
      err?.response?.data?.error ||
      "";

    // Auth invalid (token expired, inactivity logout, blocked)
    if (status === 401 || status === 403 || status === 423) {
      emitAuthInvalid({ status, url, message: String(msg || "") });
    }

    // Daily request limit
    if (status === 429) {
      emitRateLimited({ status, url, message: String(msg || "") });
    }

    return Promise.reject(err);
  }
);
