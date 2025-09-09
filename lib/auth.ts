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
  private static readonly COOKIE_NAME = "blackred_auth"

  static getStoredAuth(): AuthState {
    if (typeof window === "undefined") {
      return { user: null, isAuthenticated: false, isLoading: false }
    }

    try {
      // Try to get auth data from cookie
      const cookieValue = this.getCookie(this.COOKIE_NAME)

      if (cookieValue) {
        const user = JSON.parse(cookieValue)
        return { user, isAuthenticated: true, isLoading: false }
      }
    } catch (error) {
      console.error("Error reading auth from cookie:", error)
    }

    return { user: null, isAuthenticated: false, isLoading: false }
  }

  static setStoredAuth(user: User): void {
    if (typeof window !== "undefined") {
      // Set cookie via document.cookie for client-side
      const cookieValue = JSON.stringify(user)
      document.cookie = `${this.COOKIE_NAME}=${encodeURIComponent(cookieValue)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=lax`
    }
  }

  static clearStoredAuth(): void {
    if (typeof window !== "undefined") {
      // Clear cookie
      document.cookie = `${this.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
  }

  private static getCookie(name: string): string | null {
    if (typeof window === "undefined") return null

    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(';').shift() || '')
    }
    return null
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
