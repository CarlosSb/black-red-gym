export interface User {
  id: string
  email: string
  name: string
  role: "ADMIN" | "USER"
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export class AuthService {
  private static readonly STORAGE_KEY = "blackred_auth"

  static getStoredAuth(): AuthState {
    if (typeof window === "undefined") {
      return { user: null, isAuthenticated: false, isLoading: false }
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const user = JSON.parse(stored)
        return { user, isAuthenticated: true, isLoading: false }
      }
    } catch (error) {
      console.error("Error reading auth from storage:", error)
    }

    return { user: null, isAuthenticated: false, isLoading: false }
  }

  static setStoredAuth(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
    }
  }

  static clearStoredAuth(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  }

  static async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (result.success && result.user) {
        this.setStoredAuth(result.user)
        return { success: true, user: result.user }
      } else {
        return { success: false, error: result.error || 'Erro ao fazer login' }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Erro interno do servidor" }
    }
  }

  static async register(
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const result = await response.json()

      if (result.success && result.user) {
        this.setStoredAuth(result.user)
        return { success: true, user: result.user }
      } else {
        return { success: false, error: result.error || 'Erro ao criar conta' }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "Erro interno do servidor" }
    }
  }

  static logout(): void {
    this.clearStoredAuth()
  }
}
