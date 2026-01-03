import apiClient from './apiClient'
import { AuthResponse, User } from '../models/User'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  country: string
  postalCode: string
  street: string
  city: string
  state?: string
  phone: string
  document: string
  birthDate: string
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data)
    this.setAuthData(response.data)
    return response.data
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    this.setAuthData(response.data)
    return response.data
  }

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  private setAuthData(data: AuthResponse): void {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      id: data.userId,
      email: data.email,
      name: data.name,
    }))
  }
}

export const authService = new AuthService()

