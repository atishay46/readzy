import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

import {
  getAllBooks,
  getActiveBooks,
  addBook as addBookApi,
  readBook as markBookAsRead,
  deleteBook as deleteBookApi,
} from "../api/books";

import { useAuth } from "./AuthContext";

export interface Book {
  _id: string;
  title: string;
  drivePreviewUrl: string;
  isActive: boolean;
  lastReadAt: number | null;
}

interface BookContextType {
  books: Book[];
  activeBooks: Book[];
  addBook: (title: string, drivePreviewUrl: string) => Promise<void>;
  markAsRead: (bookId: string) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [activeBooks, setActiveBooks] = useState<Book[]>([]);

  /**
   * Load books ONLY when authenticated
   */
  useEffect(() => {
    if (!isAuthenticated) {
      setBooks([]);
      setActiveBooks([]);
      return;
    }

    const loadBooks = async () => {
      try {
        const allBooksRes = await getAllBooks();
        setBooks(allBooksRes.data);

        const activeBooksRes = await getActiveBooks();
        setActiveBooks(activeBooksRes.data);
      } catch (error) {
        console.error("Failed to load books:", error);
      }
    };

    loadBooks();
  }, [isAuthenticated]);

  /**
   * Add a new book
   */
  const addBook = useCallback(
    async (title: string, drivePreviewUrl: string) => {
      try {
        const response = await addBookApi({ title, drivePreviewUrl });
        setBooks((prev) => [...prev, response.data]);
      } catch (error) {
        console.error("Failed to add book:", error);
      }
    },
    []
  );

  /**
   * Mark book as read (LRU handled by backend)
   */
  const markAsRead = useCallback(async (bookId: string) => {
    try {
      await markBookAsRead(bookId);

      const allBooksRes = await getAllBooks();
      setBooks(allBooksRes.data);

      const activeBooksRes = await getActiveBooks();
      setActiveBooks(activeBooksRes.data);
    } catch (error) {
      console.error("Failed to mark book as read:", error);
    }
  }, []);

  /**
   * Delete a book
   */
  const deleteBook = useCallback(async (bookId: string) => {
    try {
      await deleteBookApi(bookId);
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      setActiveBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  }, []);

  return (
    <BookContext.Provider
      value={{
        books,
        activeBooks,
        addBook,
        markAsRead,
        deleteBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};
