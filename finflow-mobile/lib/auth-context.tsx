import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getApiErrorMessage, login as apiLogin, register as apiRegister, setAccessToken } from "./api";
import { storage } from "./storage";
import { User } from "./types";

const TOKEN_KEY = "finflow_token";
const USER_KEY = "finflow_user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { fullName: string; username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [token, storedUser] = await Promise.all([
          storage.getItem(TOKEN_KEY),
          storage.getItem(USER_KEY),
        ]);

        if (token && storedUser) {
          setAccessToken(token);
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function persistSession(token: string, sessionUser: User) {
    setAccessToken(token);
    setUser(sessionUser);
    await Promise.all([
      storage.setItem(TOKEN_KEY, token),
      storage.setItem(USER_KEY, JSON.stringify(sessionUser)),
    ]);
  }

  async function login(email: string, password: string) {
    try {
      const result = await apiLogin(email, password);
      await persistSession(result.token, {
        userId: result.userId,
        email: result.email,
        fullName: result.fullName,
        role: result.role,
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async function register(input: { fullName: string; username: string; email: string; password: string }) {
    try {
      await apiRegister(input);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async function logout() {
    setAccessToken(null);
    setUser(null);
    await Promise.all([storage.deleteItem(TOKEN_KEY), storage.deleteItem(USER_KEY)]);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
