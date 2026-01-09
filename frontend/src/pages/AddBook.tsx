import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Link as LinkIcon, Loader2, CheckCircle } from 'lucide-react';
import { useBooks } from '@/context/BookContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AddBook: React.FC = () => {
  const [title, setTitle] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addBook } = useBooks();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validate Google Drive URL format
  const isValidDriveUrl = (url: string): boolean => {
    if (!url) return false;
    const drivePatterns = [
      /^https:\/\/drive\.google\.com\/file\/d\/.+/,
      /^https:\/\/drive\.google\.com\/open\?id=.+/,
      /^https:\/\/docs\.google\.com\/document\/d\/.+/,
    ];
    return drivePatterns.some((pattern) => pattern.test(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: 'Missing title',
        description: 'Please enter a book title.',
        variant: 'destructive',
      });
      return;
    }

    if (!driveUrl.trim()) {
      toast({
        title: 'Missing URL',
        description: 'Please enter a Google Drive link.',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidDriveUrl(driveUrl)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid Google Drive link.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addBook(title.trim(), driveUrl.trim());

      toast({
        title: 'Book added!',
        description: `"${title}" has been added to your library.`,
      });

      navigate('/library');
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add book. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const urlIsValid = driveUrl ? isValidDriveUrl(driveUrl) : null;

  return (
    <PageLayout>
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Add New Book
          </h1>
          <p className="mt-1 text-muted-foreground">
            Add a book from your Google Drive to your library
          </p>
        </div>

        <Card className="animate-slide-up border-sky-blue/30 shadow-card">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal">
              <BookOpen className="h-6 w-6" />
            </div>
            <CardTitle className="font-heading text-xl">Book Details</CardTitle>
            <CardDescription>
              Enter the book title and Google Drive link
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Book Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Drive URL */}
              <div className="space-y-2">
                <Label htmlFor="driveUrl">Google Drive PDF Link</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="driveUrl"
                    type="url"
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    disabled={isSubmitting}
                    className={`pl-10 ${
                      urlIsValid === false ? 'border-destructive' : ''
                    } ${urlIsValid === true ? 'border-teal' : ''}`}
                  />
                  {urlIsValid === true && (
                    <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal" />
                  )}
                </div>
                {urlIsValid === false && (
                  <p className="text-xs text-destructive">
                    Please enter a valid Google Drive URL
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/library')}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !urlIsValid}
                className="flex-1 bg-teal text-beige"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Add Book
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AddBook;
