import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Link as LinkIcon, Loader2, CheckCircle } from 'lucide-react';
import { useBooks } from '@/context/BookContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

/**
 * Add Book Page - Add new book metadata
 * 
 * TODO (Backend):
 * POST /books - Store only metadata, not PDF file
 */
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      addBook(title.trim(), driveUrl.trim());
      
      toast({
        title: 'Book added!',
        description: `"${title}" has been added to your library.`,
      });
      
      navigate('/library');
      
      // TODO (Backend):
      // const response = await api.post('/books', { title, drivePreviewUrl: driveUrl });
      // Handle response and navigate
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
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Book Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Atomic Habits"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-sky-blue/50 focus:border-teal"
                  disabled={isSubmitting}
                />
              </div>

              {/* Drive URL Field */}
              <div className="space-y-2">
                <Label htmlFor="driveUrl" className="text-foreground">
                  Google Drive PDF Link
                </Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="driveUrl"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    className={`pl-10 border-sky-blue/50 focus:border-teal ${
                      urlIsValid === false ? 'border-destructive' : ''
                    } ${urlIsValid === true ? 'border-teal' : ''}`}
                    disabled={isSubmitting}
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
                <p className="text-xs text-muted-foreground">
                  Paste the share link from Google Drive. Make sure the file is accessible.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/library')}
                className="flex-1 border-sky-blue text-foreground hover:bg-sky-blue/10"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal text-beige hover:bg-teal/90"
                disabled={isSubmitting || !title.trim() || !urlIsValid}
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

        {/* Help Card */}
        <Card className="mt-6 animate-slide-up border-sky-blue/30 bg-sky-blue/5" style={{ animationDelay: '100ms' }}>
          <CardContent className="py-4">
            <h3 className="font-medium text-foreground">How to get a Google Drive link</h3>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Open Google Drive and find your PDF</li>
              <li>Right-click the file and select "Get link"</li>
              <li>Make sure "Anyone with the link" can view</li>
              <li>Copy and paste the link above</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AddBook;
