import { auth } from "./firebase";

// Single API client for the backend. Base URL comes from VITE_API_URL. Every
// request attaches `Authorization: Bearer <idToken>` when a user is signed in,
// parses JSON, and throws a typed ApiError on non-2xx responses.
const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function authHeaders() {
  const user = auth?.currentUser;
  if (!user) {
    return {};
  }
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const withAuth = await authHeaders();

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...withAuth,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Parse the body once (tolerating empty responses / non-JSON error pages).
  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data && data.message) ||
      (data && data.error) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body }),
  delete: (path, options) =>
    request(path, { ...options, method: "DELETE" }),
};

export default api;
