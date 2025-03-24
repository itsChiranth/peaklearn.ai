"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { apiClient } from "@/lib/api-client"

type User = {
  id: string
  name: string
  email: string
}

type AuthState = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const initialState: AuthState = {
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
}

const AuthContext = createContext<AuthState>(initialState)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const response = await apiClient.get("/api/user/me")
        setUser(response.data.user)
      } catch (error) {
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (!loading) {
      if (!user && !pathname.includes("/auth")) {
        router.push("/auth/login")
      } else if (user && pathname.includes("/auth")) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, router, pathname])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      })
      localStorage.setItem("token", response.data.token)
      const userResponse = await apiClient.get("/api/user/me")
      setUser(userResponse.data.user)
      router.push("/dashboard")
    } catch (error) {
      throw error
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      await apiClient.post("/api/auth/signup", {
        name,
        email,
        password,
      })
      await login(email, password)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/auth/login")
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

