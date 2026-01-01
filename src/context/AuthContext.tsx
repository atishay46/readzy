import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'smart_shelf_token';
const USER_KEY = 'smart_shelf_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Login user with email and password
   * TODO (Backend): Replace with POST /auth/login
   * Save real JWT from backend response
   */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // TEMP ONLY (REMOVE AFTER BACKEND):
    // Simulating successful login for demo
    if (email && password) {
      const dummyUser: User = {
        id: 'user_1',
        name: email.split('@')[0],
        email,
      };
      const dummyToken = 'dummy_jwt_token_' + Date.now();

      localStorage.setItem(TOKEN_KEY, dummyToken);
      localStorage.setItem(USER_KEY, JSON.stringify(dummyUser));
      setUser(dummyUser);

      // TODO (Backend):
      // const response = await api.post('/auth/login', { email, password });
      // localStorage.setItem(TOKEN_KEY, response.data.token);
      // setUser(response.data.user);

      return true;
    }

    return false;
  }, []);

  /**
   * Register new user
   * TODO (Backend): POST /auth/signup
   * Password hashing handled server-side
   */
  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // TEMP ONLY (REMOVE AFTER BACKEND):
    // Simulating successful signup for demo
    if (name && email && password) {
      // TODO (Backend):
      // const response = await api.post('/auth/signup', { name, email, password });
      // Return success and redirect to login
      return true;
    }

    return false;
  }, []);

  /**
   * Logout current user
   * TODO (Backend): POST /auth/logout (if using refresh tokens)
   */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);

    // TODO (Backend):
    // await api.post('/auth/logout'); // If invalidating tokens server-side
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
