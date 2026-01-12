import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

import { login as loginApi, signup as signupApi } from "../api/auth";

// --------------------
// Types
// --------------------
interface User {
  _id: string;
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

// --------------------
// Context
// --------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔑 MUST match apiFetch
const TOKEN_KEY = "token";
const USER_KEY = "user";

// --------------------
// Provider
// --------------------
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Restore session on refresh
   */
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
   * Login user (REAL BACKEND)
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await loginApi({ email, password });

      // 1. Save token
      localStorage.setItem(TOKEN_KEY, res.token);

      // 2. Fetch logged-in user
      const userRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${res.token}`,
          },
        }
      );

      if (!userRes.ok) {
        throw new Error("Failed to fetch user");
      }

      const user: User = await userRes.json();

      // 3. Save user
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setUser(user);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }, []);

  /**
   * Signup user (REAL BACKEND)
   */
  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        await signupApi({ name, email, password });
        return true;
      } catch (error) {
        console.error("Signup failed:", error);
        return false;
      }
    },
    []
  );

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
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

// --------------------
// Hook
// --------------------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
