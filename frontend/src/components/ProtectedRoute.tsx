import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute
 * ----------------
 * Guards routes that require authentication.
 *
 * Behavior:
 * - While auth state is loading → show spinner
 * - If user is not authenticated → redirect to /login
 * - If authenticated → render protected content
 *
 * Notes:
 * - JWT validation happens on the backend (via middleware)
 * - Frontend only checks auth state + token presence
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // While checking auth state (on refresh)
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Authenticated → allow access
  return <>{children}</>;
};

export default ProtectedRoute;
