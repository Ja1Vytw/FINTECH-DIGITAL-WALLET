import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../core/hooks/useAuth'
import { LanguageSelector } from '../shared/components/LanguageSelector'
import {
  Home,
  CreditCard,
  Receipt,
  BarChart3,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

export function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(saved === 'true')
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems: NavItem[] = [
    { href: '/home', label: t('navigation.home'), icon: <Home className="w-5 h-5" /> },
    { href: '/payments', label: t('navigation.payments'), icon: <CreditCard className="w-5 h-5" /> },
    { href: '/transactions', label: t('navigation.statement'), icon: <Receipt className="w-5 h-5" /> },
    { href: '/dashboard', label: t('navigation.charts'), icon: <BarChart3 className="w-5 h-5" /> },
    { href: '/wallet', label: t('wallet.title'), icon: <Wallet className="w-5 h-5" /> },
    { href: '/settings', label: t('settings.title'), icon: <Settings className="w-5 h-5" /> },
  ]

  return (
    <div
      className={`min-h-screen bg-white dark:bg-[#0f172a] pb-20 lg:pb-0 transition-all duration-300 ${
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}
    >
      <main className="w-full">{<Outlet />}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e293b] border-t border-[#e5e7eb] dark:border-[#334155] lg:hidden z-50" aria-label="Navegação inferior">
        <div className="flex items-center overflow-x-auto h-16 px-2">
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors min-w-[70px] flex-shrink-0 ${
                  isActive ? 'text-primary' : 'text-[#6b7280] dark:text-[#9ca3af] hover:text-[#1f2937] dark:hover:text-[#f9fafb]'
                }`}
                aria-label={item.label}
              >
                {item.icon}
                <span className="text-[10px] font-medium text-center">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <aside
        className={`hidden lg:block fixed left-0 top-0 bottom-0 bg-white dark:bg-[#1e293b] border-r border-[#e5e7eb] dark:border-[#334155] overflow-y-auto transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
        aria-label="Navegação lateral"
      >
        <div className="p-6">
          <div
            className={`flex items-center mb-8 transition-all duration-300 ${
              isCollapsed ? 'justify-center' : 'gap-3'
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0">
              <div className="w-5 h-5 bg-white rounded-md" />
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-[#1f2937] dark:text-[#f9fafb] whitespace-nowrap overflow-hidden">Digital Wallet</h1>
            )}
          </div>

          <nav className="space-y-2" aria-label="Menu principal">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-[#6b7280] dark:text-[#9ca3af] hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b] hover:text-[#1f2937] dark:hover:text-[#f9fafb]'
                  } ${isCollapsed && 'justify-center'}`}
                  title={isCollapsed ? item.label : undefined}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-[#e5e7eb] dark:border-[#334155]">
            <div className="flex items-center gap-3 mb-4 px-4">
              {!isCollapsed && (
                <>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1f2937] dark:text-[#f9fafb] truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-[#6b7280] dark:text-[#9ca3af] truncate">{user?.email || ''}</p>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-[#6b7280] dark:text-[#9ca3af] hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b] hover:text-[#1f2937] dark:hover:text-[#f9fafb] ${
                isCollapsed && 'justify-center'
              }`}
              title={isCollapsed ? t('settings.expandSidebar') : t('settings.collapseSidebar')}
              aria-label={isCollapsed ? t('settings.expandSidebar') : t('settings.collapseSidebar')}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">{t('settings.collapse')}</span>
                </>
              )}
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-[#6b7280] dark:text-[#9ca3af] hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b] hover:text-[#1f2937] dark:hover:text-[#f9fafb] ${
                isCollapsed && 'justify-center'
              }`}
              aria-label={t('auth.logout')}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium">{t('auth.logout')}</span>}
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
