"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

interface User {
  userId: string
  name: string
  email: string
  role?: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("finflow_user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUser(parsedUser);
        }
      } catch (err) {
        console.error("Geçersiz kullanıcı verisi:", err);
        localStorage.removeItem("finflow_user"); // bozuk veriyi temizle
      }
    }

    setIsLoading(false);
  }, []);


  const login = (userData: User) => {
    if (!userData) return;

    setUser(userData);
    localStorage.setItem("finflow_user", JSON.stringify(userData));
  };


  const logout = () => {
    setUser(null)
    localStorage.removeItem("finflow_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}