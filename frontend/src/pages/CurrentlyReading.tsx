import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Library } from 'lucide-react';
import { useBooks } from '@/context/BookContext';
import PageLayout from '@/components/PageLayout';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CurrentlyReading: React.FC = () => {
  const { activeBooks } = useBooks();

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="font-heading text-3xl font-bold md:text-4xl">
            Currently Reading
          </h1>
          <p className="mt-1 text-muted-foreground">
            {activeBooks.length} of 3 reading slots in use
          </p>
        </div>

        <Card className="border-sky-blue/30">
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Reading Slots:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((slot) => (
                  <div
                    key={slot}
                    className={`h-3 w-8 rounded-full ${
                      slot <= activeBooks.length
                        ? 'bg-teal'
                        : 'bg-sky-blue/30'
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

        {activeBooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeBooks.map((book) => (
              <BookCard key={book._id} book={book} showReadButton />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-center">
            <BookOpen className="h-10 w-10 text-teal mb-4" />
            <h2 className="text-xl font-semibold">No active books</h2>
            <p className="mt-2 text-muted-foreground">
              Start reading a book from your library.
            </p>
            <Button asChild className="mt-6 bg-teal text-beige">
              <Link to="/library">
                <Library className="mr-2 h-4 w-4" />
                Go to Library
              </Link>
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CurrentlyReading;
