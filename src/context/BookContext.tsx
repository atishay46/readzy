import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Book interface matching backend schema
export interface Book {
  id: string;
  title: string;
  drivePreviewUrl: string;
  isActive: boolean;
  lastReadAt: string | null;
}

interface BookContextType {
  books: Book[];
  activeBooks: Book[];
  addBook: (title: string, drivePreviewUrl: string) => void;
  markAsRead: (bookId: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

// Dummy data for UI development
const DUMMY_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Atomic Habits',
    drivePreviewUrl: 'https://drive.google.com/file/d/example1/preview',
    isActive: true,
    lastReadAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Deep Work',
    drivePreviewUrl: 'https://drive.google.com/file/d/example2/preview',
    isActive: true,
    lastReadAt: '2024-01-14T08:00:00Z',
  },
  {
    id: '3',
    title: 'The Psychology of Money',
    drivePreviewUrl: 'https://drive.google.com/file/d/example3/preview',
    isActive: false,
    lastReadAt: null,
  },
  {
    id: '4',
    title: 'Clean Code',
    drivePreviewUrl: 'https://drive.google.com/file/d/example4/preview',
    isActive: true,
    lastReadAt: '2024-01-13T15:00:00Z',
  },
  {
    id: '5',
    title: 'The Pragmatic Programmer',
    drivePreviewUrl: 'https://drive.google.com/file/d/example5/preview',
    isActive: false,
    lastReadAt: null,
  },
  {
    id: '6',
    title: 'Designing Data-Intensive Applications',
    drivePreviewUrl: 'https://drive.google.com/file/d/example6/preview',
    isActive: false,
    lastReadAt: null,
  },
];

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(DUMMY_BOOKS);

  // Computed: Get only active books (max 3 enforced by backend)
  const activeBooks = books.filter((book) => book.isActive);

  /**
   * Add a new book to the library
   * TODO (Backend): POST /books - Store only metadata, not PDF file
   */
  const addBook = useCallback((title: string, drivePreviewUrl: string) => {
    const newBook: Book = {
      id: crypto.randomUUID(),
      title,
      drivePreviewUrl,
      isActive: false,
      lastReadAt: null,
    };
    
    setBooks((prev) => [...prev, newBook]);
    
    // TODO (Backend):
    // Replace with: await api.post('/books', { title, drivePreviewUrl });
    // Response will include the created book with server-generated ID
  }, []);

  /**
   * Mark a book as being read - triggers backend LRU logic
   * TODO (Backend): POST /books/:id/read
   * Backend will handle LRU eviction and return updated active books
   */
  const markAsRead = useCallback((bookId: string) => {
    // TEMP ONLY (REMOVE AFTER BACKEND):
    // Simulating backend LRU response
    // In production, this will be replaced with actual API call
    
    setBooks((prev) => {
      const updatedBooks = prev.map((book) => {
        if (book.id === bookId) {
          return {
            ...book,
            isActive: true,
            lastReadAt: new Date().toISOString(),
          };
        }
        return book;
      });

      // TEMP ONLY (REMOVE AFTER BACKEND):
      // Simulate LRU - keep only 3 most recently read books active
      const activeCount = updatedBooks.filter((b) => b.isActive).length;
      if (activeCount > 3) {
        const sortedActive = updatedBooks
          .filter((b) => b.isActive)
          .sort((a, b) => {
            const dateA = a.lastReadAt ? new Date(a.lastReadAt).getTime() : 0;
            const dateB = b.lastReadAt ? new Date(b.lastReadAt).getTime() : 0;
            return dateA - dateB;
          });
        
        const oldestId = sortedActive[0]?.id;
        return updatedBooks.map((book) =>
          book.id === oldestId ? { ...book, isActive: false } : book
        );
      }

      return updatedBooks;
    });

    // TODO (Backend):
    // const response = await api.post(`/books/${bookId}/read`);
    // setBooks(response.data.books); // Backend returns updated book list
    // Backend enforces max 3 active books using LRU algorithm
  }, []);

  return (
    <BookContext.Provider value={{ books, activeBooks, addBook, markAsRead }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
