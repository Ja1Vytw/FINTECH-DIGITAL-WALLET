import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/app/core/hooks/useAuth'
import { Card } from '@/app/shared/components/Card'
import { LanguageSelector } from '@/app/shared/components/LanguageSelector'
import { ThemeToggle } from '@/app/shared/components/ThemeToggle'
import { User, Globe, Bell, Shield, Moon } from 'lucide-react'

interface SettingItem {
  label: string
  value: string | ReactNode
}

interface SettingSection {
  title: string
  icon: ReactNode
  items: SettingItem[]
}

export function SettingsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const settingsSections: SettingSection[] = [
    {
      title: t('settings.profile'),
      icon: <User className="w-5 h-5" />,
      items: [
        { label: t('settings.name'), value: user?.name || '-' },
        { label: t('settings.email'), value: user?.email || '-' },
      ],
    },
    {
      title: t('settings.preferences'),
      icon: <Globe className="w-5 h-5" />,
      items: [
        {
          label: t('settings.language'),
          value: <LanguageSelector />,
        },
        {
          label: t('settings.theme'),
          value: <ThemeToggle />,
        },
      ],
    },
    {
      title: t('settings.notifications'),
      icon: <Bell className="w-5 h-5" />,
      items: [
        { label: t('settings.emailNotifications'), value: t('settings.enabled') },
        { label: t('settings.pushNotifications'), value: t('settings.enabled') },
      ],
    },
    {
      title: t('settings.security'),
      icon: <Shield className="w-5 h-5" />,
      items: [
        { label: t('settings.twoFactorAuth'), value: t('settings.disabled') },
        { label: t('settings.changePassword'), value: t('settings.change') },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white dark:from-[#0f172a] via-[#f3f4f6]/20 dark:via-[#1e293b]/20 to-white dark:to-[#0f172a] p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1f2937] dark:text-[#f9fafb] mb-2">{t('settings.title')}</h1>
          <p className="text-[#6b7280] dark:text-[#9ca3af]">{t('settings.description')}</p>
        </div>

        <div className="space-y-6">
          {settingsSections.map((section, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold text-[#1f2937] dark:text-[#f9fafb]">{section.title}</h2>
              </div>

              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between py-3 border-b border-[#e5e7eb] dark:border-[#334155] last:border-0"
                  >
                    <span className="text-sm font-medium text-[#1f2937] dark:text-[#f9fafb]">{item.label}</span>
                    {typeof item.value === 'string' ? (
                      <span className="text-sm text-[#6b7280] dark:text-[#9ca3af]">{item.value}</span>
                    ) : (
                      <div className="flex items-center">{item.value}</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

