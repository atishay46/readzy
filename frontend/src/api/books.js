import { apiFetch } from "./api";

// GET /books
export const getAllBooks = () => apiFetch("/books");

// GET /books/active
export const getActiveBooks = () => apiFetch("/books/active");

// POST /books
export const addBook = (data) =>
  apiFetch("/books", {
    method: "POST",
    body: JSON.stringify(data),
  });

// POST /books/:id/read
export const readBook = (id) =>
  apiFetch(`/books/${id}/read`, {
    method: "POST",
  });

// DELETE /books/:id
export const deleteBook = (id) =>
  apiFetch(`/books/${id}`, {
    method: "DELETE",
  });
