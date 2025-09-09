"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { AuthService, type AuthState } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: (action?: "login" | "register") => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Load auth state from storage on mount
    console.log("🔄 Carregando estado de autenticação...")
    const stored = AuthService.getStoredAuth()
    console.log("📦 Estado armazenado:", stored)
    setAuthState({ ...stored, isLoading: false })
  }, [])

  const login = async (email: string, password: string, redirectTo?: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const result = await AuthService.login(email, password)

    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      })

      // Redirecionamento baseado no tipo de usuário
      if (redirectTo) {
        // Se foi especificado um redirecionamento, usar ele
        window.location.href = redirectTo
      } else {
        // Redirecionamento automático baseado no tipo de usuário
        if (result.user.role === 'ADMIN') {
          window.location.href = '/dashboard'
        } else if (result.user.role === 'USER') {
          window.location.href = '/student/dashboard'
        } else {
          window.location.href = '/'
        }
      }

      return { success: true }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return { success: false, error: result.error }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const result = await AuthService.register(name, email, password)

    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      })
      return { success: true }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return { success: false, error: result.error }
    }
  }

  const loginWithGoogle = (action: "login" | "register" = "login") => {
    window.location.href = `/api/auth/google?action=${action}`
  }

  const logout = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Error during logout:', error)
    }

    // Clear client-side state
    AuthService.logout()
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
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
