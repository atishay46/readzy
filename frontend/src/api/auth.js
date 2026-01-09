import { apiFetch } from "./api";

export const login = (data) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data)
  });

export const signup = (data) =>
  apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data)
  });
