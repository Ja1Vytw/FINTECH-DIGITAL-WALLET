import { Card } from '@/app/shared/components/Card'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '@/app/shared/utils/format'
import { Wallet } from 'lucide-react'

interface BalanceCardProps {
  balance: number
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'pt-BR' || i18n.language === 'pt-PT' ? 'pt-BR' : 'en-US'

  return (
    <Card className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 lg:p-8 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white/80 text-sm mb-2">{t('wallet.balance')}</p>
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold" aria-label={`${t('wallet.balance')}: ${formatCurrency(balance, locale)}`}>
              {formatCurrency(balance, locale)}
            </h2>
          </div>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Wallet className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  )
}
