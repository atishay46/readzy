import { apiFetch } from "./api";

/**
 * POST /auth/login
 * @param {Object} data { email, password }
 */
export const login = (data) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

/**
 * POST /auth/signup
 * @param {Object} data { name, email, password }
 */
export const signup = (data) =>
  apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
