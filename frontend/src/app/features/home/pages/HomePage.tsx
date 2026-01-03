import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { walletService } from '@/app/features/wallet/services/walletService'
import { transactionService, Transaction } from '@/app/features/transactions/services/transactionService'
import { useAuth } from '@/app/core/hooks/useAuth'
import { formatCurrency, formatDate } from '@/app/shared/utils/format'
import { Card } from '@/app/shared/components/Card'
import { Button } from '@/app/shared/components/Button'
import { 
  CreditCard, 
  Send, 
  Download, 
  Receipt, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  LogOut,
  ArrowUp,
  ArrowDown,
  Wallet
} from 'lucide-react'

export function HomePage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [balance, setBalance] = useState(0)
  const [showBalance, setShowBalance] = useState(true)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [balanceData, transactionsData] = await Promise.all([
        walletService.getBalance(),
        transactionService.getTransactions({ limit: 5 }),
      ])
      setBalance(balanceData.balance)
      setRecentTransactions(transactionsData)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const locale = i18n.language === 'pt-BR' || i18n.language === 'pt-PT' ? 'pt-BR' : 'en-US'

  const quickActions = [
    {
      icon: <CreditCard className="w-6 h-6" />,
      label: t('home.pay'),
      description: t('home.payDescription'),
      onClick: () => navigate('/payments'),
      color: 'from-primary to-primary-dark',
    },
    {
      icon: <Send className="w-6 h-6" />,
      label: t('home.transfer'),
      description: t('home.transfer'),
      onClick: () => navigate('/payments'),
      color: 'from-success to-emerald-600',
    },
    {
      icon: <Download className="w-6 h-6" />,
      label: t('home.deposit'),
      description: t('home.deposit'),
      onClick: () => navigate('/wallet'),
      color: 'from-warning to-orange-600',
    },
    {
      icon: <Receipt className="w-6 h-6" />,
      label: t('home.statement'),
      description: t('home.viewAll'),
      onClick: () => navigate('/transactions'),
      color: 'from-purple-500 to-purple-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white dark:from-[#0f172a] via-[#f3f4f6]/20 dark:via-[#1e293b]/20 to-white dark:to-[#0f172a] p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#6b7280] dark:text-[#9ca3af] text-sm">{t('common.welcome')},</p>
            <h1 className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb]">{user?.name?.split(' ')[0] || 'User'}</h1>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            className="text-[#6b7280] dark:text-[#9ca3af]"
            aria-label={t('auth.logout')}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 lg:p-8 mb-8 shadow-lg">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-white/80 text-sm mb-2">
                {t('home.availableBalance')}
              </p>
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-bold">
                  {isLoading ? '...' : showBalance ? formatCurrency(balance, locale) : '••••••'}
                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label={showBalance ? t('home.hideBalance') : t('home.showBalance')}
                >
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/90 text-sm bg-white/10 rounded-lg px-4 py-3">
            <TrendingUp className="w-4 h-4" />
            <span>
              {t('home.yields')} 100% CDI {t('home.perYear')}
            </span>
          </div>
        </Card>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#1f2937] dark:text-[#f9fafb] mb-4">{t('home.quickActions')}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="bg-white dark:bg-[#1e293b] hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b]/50 border border-[#e5e7eb] dark:border-[#334155] rounded-xl p-4 transition-all hover:shadow-lg text-left group"
                aria-label={action.label}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}
                >
                  {action.icon}
                </div>
                <p className="font-semibold text-[#1f2937] dark:text-[#f9fafb] mb-1">{action.label}</p>
                <p className="text-xs text-[#6b7280] dark:text-[#9ca3af]">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1f2937] dark:text-[#f9fafb]">{t('home.recentTransactions')}</h3>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/transactions')} 
              className="text-primary"
            >
              {t('home.viewAll')}
            </Button>
          </div>

          <Card className="divide-y divide-[#e5e7eb] dark:divide-[#334155]">
            {isLoading ? (
              <div className="p-8 text-center text-[#6b7280] dark:text-[#9ca3af]">{t('common.loading')}</div>
            ) : recentTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <Receipt className="w-12 h-12 text-[#6b7280] dark:text-[#9ca3af] mx-auto mb-3 opacity-50" />
                <p className="text-[#6b7280] dark:text-[#9ca3af]">{t('home.noTransactions')}</p>
                <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] mt-1">{t('transactions.transactionsWillAppearHere')}</p>
              </div>
            ) : (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-[#f3f4f6]/50 dark:hover:bg-[#1e293b]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'INCOME' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                        }`}
                      >
                        {transaction.type === 'INCOME' ? (
                          <ArrowDown className="w-5 h-5" />
                        ) : (
                          <ArrowUp className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#1f2937] dark:text-[#f9fafb]">
                          {transaction.categoryName || (transaction.type === 'INCOME' ? t('transactions.income') : t('transactions.expense'))}
                        </p>
                        <p className="text-sm text-[#6b7280] dark:text-[#9ca3af]">
                          {transaction.description || formatDate(transaction.createdAt, locale)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.type === 'INCOME' ? 'text-success' : 'text-danger'}`}
                      >
                        {transaction.type === 'INCOME' ? '+' : '-'}
                        {formatCurrency(transaction.amount, locale)}
                      </p>
                      <p className="text-xs text-[#6b7280] dark:text-[#9ca3af]">{formatDate(transaction.createdAt, locale)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
