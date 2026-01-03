import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionList } from '../components/TransactionList'
import { transactionService, Transaction, TransactionType } from '../services/transactionService'
import { Button } from '@/app/shared/components/Button'
import { Card } from '@/app/shared/components/Card'
import { Input } from '@/app/shared/components/Input'
import { 
  Filter, 
  Search, 
  Calendar, 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown,
  Receipt
} from 'lucide-react'

export function TransactionsPage() {
  const { t } = useTranslation()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [filterType, setFilterType] = useState<'' | TransactionType>('')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const data = await transactionService.getTransactions()
      setTransactions(data)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = async () => {
    try {
      setIsLoading(true)
      const params: {
        type?: TransactionType
        categoryId?: number
        startDate?: string
        endDate?: string
      } = {}

      if (filterType) params.type = filterType
      if (filterCategory) params.categoryId = Number.parseInt(filterCategory)
      if (filterStartDate) params.startDate = filterStartDate
      if (filterEndDate) params.endDate = filterEndDate

      const data = await transactionService.getTransactions(params)
      setTransactions(data)
      setShowFilters(false)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const clearFilters = () => {
    setFilterType('')
    setFilterCategory('')
    setFilterStartDate('')
    setFilterEndDate('')
    setSearchTerm('')
    fetchData()
    setShowFilters(false)
  }

  const handleSuccess = () => {
    setShowCreateForm(false)
    fetchData()
  }

  const filteredTransactions = transactions.filter((transaction) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      transaction.description?.toLowerCase().includes(searchLower) ||
      transaction.categoryName?.toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchTerm)
    )
  })

  const groupedTransactions = filteredTransactions.reduce(
    (groups, transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(transaction)
      return groups
    },
    {} as Record<string, Transaction[]>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-white dark:from-[#0f172a] via-[#f3f4f6]/20 dark:via-[#1e293b]/20 to-white dark:to-[#0f172a] p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1f2937] dark:text-[#f9fafb] mb-2">{t('transactions.title')}</h1>
          <p className="text-sm sm:text-base text-[#6b7280] dark:text-[#9ca3af]">{t('transactions.description')}</p>
        </div>

        {showCreateForm && (
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#1f2937] dark:text-[#f9fafb]">{t('transactions.createTransaction')}</h2>
              <Button onClick={() => setShowCreateForm(false)} variant="ghost" size="sm" aria-label={t('common.close')}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <TransactionForm onSuccess={handleSuccess} />
          </Card>
        )}

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] dark:text-[#9ca3af]" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('transactions.searchTransactions')}
                className="pl-10 h-12"
                aria-label={t('common.search')}
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={`h-12 ${
                filterType || filterCategory || filterStartDate || filterEndDate
                  ? 'border-primary text-primary'
                  : ''
              }`}
              aria-label={t('common.filter')}
            >
              <Filter className="w-5 h-5 mr-2" />
              {t('common.filter')}
            </Button>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="h-12 gradient-primary text-white"
              aria-label={t('transactions.addTransaction')}
            >
              {t('transactions.addTransaction')}
            </Button>
          </div>

          {showFilters && (
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">{t('common.filter')}</h3>
                <Button onClick={() => setShowFilters(false)} variant="ghost" size="sm" aria-label={t('common.close')}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('transactions.type')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => setFilterType('')}
                      variant={filterType === '' ? 'primary' : 'outline'}
                      size="sm"
                      className="w-full"
                      aria-label={t('transactions.all')}
                    >
                      {t('transactions.all')}
                    </Button>
                    <Button
                      onClick={() => setFilterType('INCOME')}
                      variant={filterType === 'INCOME' ? 'primary' : 'outline'}
                      size="sm"
                      className="w-full"
                      aria-label={t('transactions.income')}
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {t('transactions.income')}
                    </Button>
                    <Button
                      onClick={() => setFilterType('EXPENSE')}
                      variant={filterType === 'EXPENSE' ? 'primary' : 'outline'}
                      size="sm"
                      className="w-full"
                      aria-label={t('transactions.expense')}
                    >
                      <TrendingDown className="w-4 h-4 mr-1" />
                      {t('transactions.expense')}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('transactions.startDate')}</label>
                    <Input
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                      className="h-10"
                      aria-label={t('transactions.startDate')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('transactions.endDate')}</label>
                    <Input
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                      className="h-10"
                      aria-label={t('transactions.endDate')}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button onClick={applyFilters} className="flex-1 gradient-primary text-white">
                    {t('transactions.applyFilters')}
                  </Button>
                  <Button onClick={clearFilters} variant="outline" className="flex-1 bg-transparent">
                    {t('transactions.clearAll')}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : Object.keys(groupedTransactions).length === 0 ? (
            <Card className="p-8 sm:p-12 text-center">
              <Receipt className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{t('transactions.noTransactions')}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {searchTerm || filterType
                  ? t('transactions.tryAdjustingFilters')
                  : t('transactions.startMakingTransactions')}
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
                  </div>
                  <Card className="divide-y divide-border">
                    {dayTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-4 hover:bg-accent/50 transition-colors flex items-center gap-4"
                      >
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            transaction.type === 'INCOME'
                              ? 'bg-success/10 text-success'
                              : 'bg-danger/10 text-danger'
                          }`}
                        >
                          {transaction.type === 'INCOME' ? (
                            <ArrowDownRight className="w-5 h-5 sm:w-6 sm:h-6" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm sm:text-base truncate">
                            {transaction.description || transaction.categoryName || (transaction.type === 'INCOME' ? t('transactions.income') : t('transactions.expense'))}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {transaction.categoryName || (transaction.type === 'INCOME' ? t('transactions.income') : t('transactions.expense'))} •{' '}
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p
                            className={`font-semibold text-sm sm:text-base ${
                              transaction.type === 'INCOME' ? 'text-success' : 'text-danger'
                            }`}
                          >
                            {transaction.type === 'INCOME' ? '+' : '-'}
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
