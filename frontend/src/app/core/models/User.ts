export interface User {
  id: number
  email: string
  name: string
}

export interface AuthResponse {
  token: string
  userId: number
  email: string
  name: string
}

