import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";
import { useShell, UserRole } from "./ShellContext";

export interface UserType {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isEnabled: boolean;
  points: number;
  reputationScore: number;
  wardCode?: string;
  roles: string[];
}

interface AuthContextType {
  user: UserType | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<UserType>;
  register: (registerData: any) => Promise<UserType>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (passwordData: any) => Promise<void>;
  clearAuthSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setRole, setLayout } = useShell();
  const [user, setUser] = useState<UserType | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Clear session helper
  const clearAuthSession = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setAccessToken(null);
    setLayout("landing");
  };

  // Check login on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const rToken = localStorage.getItem("refreshToken");

      if (!token || !rToken) {
        setIsLoading(false);
        return;
      }

      try {
        setAccessToken(token);
        // Silently refresh on startup to get the latest user profile
        const response = await api.post("/auth/refresh", { refreshToken: rToken });
        const { accessToken: newAccessToken, user: userData } = response.data;
        
        localStorage.setItem("accessToken", newAccessToken);
        setAccessToken(newAccessToken);
        setUser(userData);

        // Sync layout and role
        if (userData.roles && userData.roles.length > 0) {
          const primaryRole = userData.roles[0].toLowerCase() as UserRole;
          setRole(primaryRole);
        }
        setLayout("authenticated");
      } catch (err) {
        // Token stale, clear and land
        clearAuthSession();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen to expiration events from api interceptor
    const handleAuthExpired = () => {
      clearAuthSession();
    };
    window.addEventListener("auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<UserType> => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { usernameOrEmail, password });
      const { accessToken: access, refreshToken: refresh, user: userData } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      setAccessToken(access);
      setUser(userData);

      // Sync user role
      if (userData.roles && userData.roles.length > 0) {
        const primaryRole = userData.roles[0].toLowerCase() as UserRole;
        setRole(primaryRole);
      }
      setLayout("authenticated");
      return userData;
    } catch (error: any) {
      throw error.response?.data?.message || "Invalid credentials provided";
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData: any): Promise<UserType> => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", registerData);
      const { accessToken: access, refreshToken: refresh, user: userData } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      setAccessToken(access);
      setUser(userData);

      if (userData.roles && userData.roles.length > 0) {
        const primaryRole = userData.roles[0].toLowerCase() as UserRole;
        setRole(primaryRole);
      }
      setLayout("authenticated");
      return userData;
    } catch (error: any) {
      throw error.response?.data?.message || "Registration failed";
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      if (token) {
        await api.post("/auth/logout", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      // Ignore failure of logout endpoint
    } finally {
      clearAuthSession();
    }
  };

  const forgotPassword = async (email: string): Promise<string> => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data.token || "";
    } catch (error: any) {
      throw error.response?.data?.message || "Could not find account";
    }
  };

  const resetPassword = async (passwordData: any): Promise<void> => {
    try {
      await api.post("/auth/reset-password", passwordData);
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to reset password";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        clearAuthSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
