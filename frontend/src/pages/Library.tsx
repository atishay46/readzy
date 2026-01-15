import React, { useState, useMemo } from "react";
import { Search, BookOpen } from "lucide-react";
import { useBooks } from "../context/BookContext";
import PageLayout from "../components/PageLayout";
import BookCard from "../components/BookCard";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";

const Library: React.FC = () => {
  const { books, markAsRead, deleteBook } = useBooks();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    return books.filter((b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [books, searchQuery]);

  const handleRead = async (bookId: string) => {
    const book = books.find((b) => b._id === bookId);

    try {
      await markAsRead(bookId);
      toast({
        title: "Opening book",
        description: `Starting "${book?.title}"...`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to start reading.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (bookId: string) => {
    try {
      await deleteBook(bookId);
      toast({
        title: "Book deleted",
        description: "The book has been removed from your library.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete book.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">My Library</h1>
            <p className="mt-1 text-muted-foreground">
              {books.length} book{books.length !== 1 && "s"}
            </p>
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onRead={handleRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-center">
            <BookOpen className="mb-4 h-10 w-10 text-teal" />
            <h2 className="text-xl font-semibold">
              {searchQuery ? "No books found" : "Your library is empty"}
            </h2>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Library;
