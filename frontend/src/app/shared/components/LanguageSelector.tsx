import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'pt-BR', label: 'Português (BR)' },
  { code: 'pt-PT', label: 'Português (PT)' },
]

export function LanguageSelector() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-transparent hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b] text-[#6b7280] dark:text-[#9ca3af] hover:text-[#1f2937] dark:hover:text-[#f9fafb] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-[#334155] rounded-lg shadow-lg z-50 overflow-hidden"
          role="menu"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b]/50 transition-colors ${
                i18n.language === lang.code ? 'bg-[#f3f4f6] dark:bg-[#1e293b]/50 text-primary font-semibold' : 'text-[#1f2937] dark:text-[#f9fafb]'
              }`}
              onClick={() => handleLanguageChange(lang.code)}
              role="menuitem"
              aria-label={`Change language to ${lang.label}`}
            >
              <span>{lang.label}</span>
              {i18n.language === lang.code && (
                <span className="text-primary" aria-hidden="true">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
