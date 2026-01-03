import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary-light">
      <main className="min-h-screen flex items-center justify-center p-4">
        <Outlet />
      </main>
    </div>
  )
}
