export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock user database (in production, this would be in a real database)
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@blackred.com.br",
    name: "Administrador",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
]

export class AuthService {
  private static readonly STORAGE_KEY = "blackred_auth"
  private static readonly USERS_KEY = "blackred_users"

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

  static getUsers(): User[] {
    if (typeof window === "undefined") return MOCK_USERS

    try {
      const stored = localStorage.getItem(this.USERS_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error("Error reading users from storage:", error)
    }

    // Initialize with mock users
    this.setUsers(MOCK_USERS)
    return MOCK_USERS
  }

  static setUsers(users: User[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
    }
  }

  static async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = this.getUsers()
    const user = users.find((u) => u.email === email)

    if (!user) {
      return { success: false, error: "Usuário não encontrado" }
    }

    // In production, you would verify the password hash
    // For demo purposes, we'll accept any password for existing users
    if (password.length < 6) {
      return { success: false, error: "Senha deve ter pelo menos 6 caracteres" }
    }

    this.setStoredAuth(user)
    return { success: true, user }
  }

  static async register(
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = this.getUsers()

    if (users.find((u) => u.email === email)) {
      return { success: false, error: "E-mail já cadastrado" }
    }

    if (password.length < 6) {
      return { success: false, error: "Senha deve ter pelo menos 6 caracteres" }
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    const updatedUsers = [...users, newUser]
    this.setUsers(updatedUsers)
    this.setStoredAuth(newUser)

    return { success: true, user: newUser }
  }

  static logout(): void {
    this.clearStoredAuth()
  }
}
