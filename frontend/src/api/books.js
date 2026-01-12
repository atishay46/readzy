import { apiFetch } from "./api";

/**
 * GET /books
 * Fetch all books (active + inactive) for logged-in user
 */
export const getAllBooks = () => apiFetch("/books");

/**
 * GET /books/active
 * Fetch only active (LRU-managed) books
 */
export const getActiveBooks = () => apiFetch("/books/active");

/**
 * POST /books
 * Add a new book
 * @param {Object} data { title, drivePreviewUrl }
 */
export const addBook = (data) =>
  apiFetch("/books", {
    method: "POST",
    body: JSON.stringify(data),
  });

/**
 * POST /books/:id/read
 * Mark book as read (triggers LRU logic in backend)
 * @param {string} id - MongoDB _id
 */
export const readBook = (id) =>
  apiFetch(`/books/${id}/read`, {
    method: "POST",
  });

/**
 * DELETE /books/:id
 * Delete a book permanently
 * @param {string} id - MongoDB _id
 */
export const deleteBook = (id) =>
  apiFetch(`/books/${id}`, {
    method: "DELETE",
  });
