import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { authService } from '../services/authService'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

