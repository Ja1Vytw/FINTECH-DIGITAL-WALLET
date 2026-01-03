import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from './app/layouts/AuthLayout'
import { MainLayout } from './app/layouts/MainLayout'
import { LoginPage } from './app/features/auth/pages/LoginPage'
import { RegisterPage } from './app/features/auth/pages/RegisterPage'
import { HomePage } from './app/features/home/pages/HomePage'
import { PaymentsPage } from './app/features/payments/pages/PaymentsPage'
import { DashboardPage } from './app/features/dashboard/pages/DashboardPage'
import { WalletPage } from './app/features/wallet/pages/WalletPage'
import { TransactionsPage } from './app/features/transactions/pages/TransactionsPage'
import { SettingsPage } from './app/features/settings/pages/SettingsPage'
import { AuthGuard } from './app/core/guards/AuthGuard'
import { ThemeProvider } from './app/core/components/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          
          <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

