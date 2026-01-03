import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BalanceCard } from '../components/BalanceCard'
import { walletService } from '../services/walletService'
import { Card } from '@/app/shared/components/Card'

export function WalletPage() {
  const { t } = useTranslation()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadWallet()
  }, [])

  const loadWallet = async () => {
    try {
      setLoading(true)
      const data = await walletService.getBalance()
      setBalance(data.balance)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading balance')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white dark:from-[#0f172a] via-[#f3f4f6]/20 dark:via-[#1e293b]/20 to-white dark:to-[#0f172a] p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="text-center text-[#6b7280] dark:text-[#9ca3af]">{t('common.loading')}</div>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white dark:from-[#0f172a] via-[#f3f4f6]/20 dark:via-[#1e293b]/20 to-white dark:to-[#0f172a] p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="text-center text-destructive" role="alert" aria-live="polite">
              {error}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white dark:from-[#0f172a] via-[#f3f4f6]/20 dark:via-[#1e293b]/20 to-white dark:to-[#0f172a] p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1f2937] dark:text-[#f9fafb] mb-8">{t('wallet.title')}</h1>
        <BalanceCard balance={balance} />
      </div>
    </div>
  )
}
