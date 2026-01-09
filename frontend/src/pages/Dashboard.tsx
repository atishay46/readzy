import React from 'react';
import { Link } from 'react-router-dom';
import { Library, BookOpen, PlusCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useBooks } from '@/context/BookContext';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { books, activeBooks } = useBooks();

  const dashboardCards = [
    {
      to: '/library',
      icon: Library,
      title: 'My Library',
      description: 'Browse all your books',
      stat: `${books.length} books`,
      gradient: 'from-teal to-navy',
    },
    {
      to: '/currently-reading',
      icon: BookOpen,
      title: 'Currently Reading',
      description: 'Your active books',
      stat: `${activeBooks.length} of 3`,
      gradient: 'from-navy to-teal',
    },
    {
      to: '/add-book',
      icon: PlusCircle,
      title: 'Add Book',
      description: 'Add a new book to your library',
      stat: 'Add now',
      gradient: 'from-teal via-sky-blue to-teal',
    },
  ];

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="font-heading text-4xl font-bold md:text-5xl">
            Welcome back, <span className="text-teal">{user?.name}</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Ready to continue your reading journey?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {dashboardCards.map(({ to, icon: Icon, title, description, stat, gradient }, index) => (
            <Link
              key={to}
              to={to}
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="relative h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-elevated">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal group-hover:bg-teal group-hover:text-beige">
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-teal" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-1 font-heading text-xl">{title}</CardTitle>
                  <CardDescription className="mb-4">{description}</CardDescription>
                  <div className="inline-flex rounded-full bg-sky-blue/30 px-3 py-1 text-sm">
                    {stat}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
