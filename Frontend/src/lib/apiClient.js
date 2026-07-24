// Shared fetch wrapper for all backend calls. Every other API module
// (api.js) goes through this so auth-header injection and error handling
// live in exactly one place.

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const ADMIN_TOKEN_KEY = "luxuz-admin-token";

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function request(path, options = {}) {
  const token = getAdminToken();
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = Array.isArray(body.detail)
      ? body.detail.map((e) => e.msg).join("; ")
      : body.detail || `Request failed (${res.status})`;
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}
