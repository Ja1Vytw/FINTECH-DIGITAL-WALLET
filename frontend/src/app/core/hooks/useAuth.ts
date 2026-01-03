import { useState, useEffect } from 'react'
import { authService, User } from '../services/authService'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return { user, loading, logout, isAuthenticated: !!user }
}

