import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { Book } from '@/context/BookContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookCardProps {
  book: Book;
  onRead?: (bookId: string) => void;
  showReadButton?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onRead, showReadButton = true }) => {
  const handleRead = () => {
    if (onRead) {
      onRead(book.id);
    }
    // Open the Google Drive preview in a new tab
    window.open(book.drivePreviewUrl, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-elevated">
      {/* Book Cover Placeholder */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-navy via-teal to-sky-blue">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="h-16 w-16 text-beige/30" />
        </div>
        <div className="absolute inset-0 bg-navy/20 transition-opacity group-hover:bg-navy/10" />
        
        {/* Status Badge */}
        {book.isActive && (
          <Badge className="absolute right-2 top-2 bg-teal text-beige">
            Reading
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 font-heading text-lg leading-tight text-foreground">
          {book.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <p className="text-xs text-muted-foreground">
          Last read: {formatDate(book.lastReadAt)}
        </p>
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        {showReadButton && (
          <Button
            onClick={handleRead}
            className="flex-1 bg-teal text-beige hover:bg-teal/90"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Read
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(book.drivePreviewUrl, '_blank', 'noopener,noreferrer')}
          className="shrink-0 border-sky-blue text-foreground hover:bg-sky-blue/20"
          title="Open in Drive"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
