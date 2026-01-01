import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Index Page - Redirects based on auth status
 */
const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking auth
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal border-t-transparent" />
        <p className="text-sky-blue">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
