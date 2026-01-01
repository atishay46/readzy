import React, { useState, useMemo } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { useBooks } from '@/context/BookContext';
import PageLayout from '@/components/PageLayout';
import BookCard from '@/components/BookCard';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

/**
 * Library Page - Shows all books owned by the user
 * 
 * NOTE:
 * - Clicking "Read" triggers markAsRead handler
 * - Do NOT remove books from library here
 * - Backend will handle LRU eviction
 */
const Library: React.FC = () => {
  const { books, markAsRead } = useBooks();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter books by search query
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    
    const query = searchQuery.toLowerCase();
    return books.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
  }, [books, searchQuery]);

  /**
   * Handle read button click
   * TODO (Backend): Call POST /books/:id/read
   * Backend will decide LRU eviction
   */
  const handleRead = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    
    markAsRead(bookId);
    
    toast({
      title: 'Opening book',
      description: `Starting "${book?.title}"...`,
    });
    
    // TODO (Backend):
    // const response = await api.post(`/books/${bookId}/read`);
    // Handle eviction notification if a book was removed from active
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="animate-fade-in">
            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              My Library
            </h1>
            <p className="mt-1 text-muted-foreground">
              {books.length} book{books.length !== 1 ? 's' : ''} in your collection
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-sm animate-fade-in">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-sky-blue/50 focus:border-teal"
            />
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book, index) => (
              <div
                key={book.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <BookCard book={book} onRead={handleRead} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sky-blue/20">
              <BookOpen className="h-10 w-10 text-teal" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {searchQuery ? 'No books found' : 'Your library is empty'}
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              {searchQuery
                ? `No books match "${searchQuery}". Try a different search term.`
                : 'Start building your collection by adding your first book.'}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Library;
