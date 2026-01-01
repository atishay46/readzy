import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Library } from 'lucide-react';
import { useBooks } from '@/context/BookContext';
import PageLayout from '@/components/PageLayout';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Currently Reading Page - Shows active books only (max 3)
 * 
 * NOTE:
 * Frontend does NOT enforce max=3
 * Backend will ensure only 3 active books are returned
 * This is a read-only display (no delete functionality)
 */
const CurrentlyReading: React.FC = () => {
  const { activeBooks } = useBooks();

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Currently Reading
          </h1>
          <p className="mt-1 text-muted-foreground">
            {activeBooks.length} of 3 reading slots in use
          </p>
        </div>

        {/* Reading Slots Indicator */}
        <Card className="animate-fade-in border-sky-blue/30 bg-card/50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Reading Slots:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((slot) => (
                  <div
                    key={slot}
                    className={`h-3 w-8 rounded-full transition-colors ${
                      slot <= activeBooks.length ? 'bg-teal' : 'bg-sky-blue/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({activeBooks.length}/3)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Active Books Grid */}
        {activeBooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeBooks.map((book, index) => (
              <div
                key={book.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <BookCard book={book} showReadButton={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sky-blue/20">
              <BookOpen className="h-10 w-10 text-teal" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              No active books
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              You haven't started reading any books yet. Visit your library to start reading!
            </p>
            <Button
              asChild
              className="mt-6 bg-teal text-beige hover:bg-teal/90"
            >
              <Link to="/library">
                <Library className="mr-2 h-4 w-4" />
                Go to Library
              </Link>
            </Button>
          </div>
        )}

        {/* LRU Info Card */}
        {activeBooks.length > 0 && (
          <Card className="animate-slide-up border-teal/30 bg-teal/5" style={{ animationDelay: '300ms' }}>
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal/20">
                  <BookOpen className="h-4 w-4 text-teal" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Smart Reading Queue</p>
                  <p className="text-sm text-muted-foreground">
                    You can have up to 3 books in your active reading list. When you start reading a 4th book, 
                    the least recently read book will automatically be moved back to your library.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default CurrentlyReading;
