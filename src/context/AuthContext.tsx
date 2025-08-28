import { createContext, useState, ReactNode } from "react";
import type { AuthContextType, User } from "../types/user";
import axios from "axios";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const response = await axios.post("https://dummyjson.com/auth/login", { username, password });
      setUser(response.data);
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid credentials";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login }}>
      {children}
    </AuthContext.Provider>
  );
};
