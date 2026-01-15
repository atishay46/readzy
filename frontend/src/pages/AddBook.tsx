import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Link as LinkIcon, Loader2, CheckCircle } from "lucide-react";
import { useBooks } from "../context/BookContext";
import PageLayout from "../components/PageLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useToast } from "../hooks/use-toast";

const AddBook: React.FC = () => {
  const [title, setTitle] = useState("");
  const [driveUrl, setDriveUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addBook } = useBooks();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isValidDriveUrl = (url: string): boolean => {
    const patterns = [
      /^https:\/\/drive\.google\.com\/file\/d\/.+/,
      /^https:\/\/drive\.google\.com\/open\?id=.+/,
      /^https:\/\/docs\.google\.com\/document\/d\/.+/,
    ];
    return patterns.some((p) => p.test(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !driveUrl.trim() || !isValidDriveUrl(driveUrl)) {
      toast({
        title: "Invalid input",
        description: "Please enter valid book details.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addBook(title.trim(), driveUrl.trim());
      toast({
        title: "Book added",
        description: `"${title}" added to your library.`,
      });
      navigate("/library");
    } catch {
      toast({
        title: "Error",
        description: "Failed to add book.",
        variant: "default",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const urlIsValid = driveUrl ? isValidDriveUrl(driveUrl) : null;

  return (
    <PageLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Add New Book</h1>

        <Card>
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
            <CardDescription>
              Add a Google Drive PDF to your library
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div>
                <Label>Book Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label>Link to Book / Google Drive Link</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    className="pl-10"
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                  />
                  {urlIsValid && (
                    <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 text-teal" />
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/library")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !urlIsValid}
                className="bg-teal text-beige"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Book"
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
