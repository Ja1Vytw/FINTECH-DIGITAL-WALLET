import { useTheme } from '@/app/core/hooks/useTheme'
import { Sun, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-transparent hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b] text-[#6b7280] dark:text-[#9ca3af] hover:text-[#1f2937] dark:hover:text-[#f9fafb] transition-colors"
      aria-label={theme === 'light' ? t('settings.switchToDark') : t('settings.switchToLight')}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">{t('settings.dark')}</span>
        </>
      ) : (
        <>
          <Sun className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">{t('settings.light')}</span>
        </>
      )}
    </button>
  )
}

