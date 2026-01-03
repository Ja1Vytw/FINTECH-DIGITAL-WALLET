import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { dashboardService, Dashboard } from '../services/dashboardService'
import { Card } from '@/app/shared/components/Card'
import { Button } from '@/app/shared/components/Button'
import { formatCurrency } from '@/app/shared/utils/format'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react'

export function DashboardPage() {
  const { t, i18n } = useTranslation()
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month')

  useEffect(() => {
    fetchDashboard()
  }, [period])

  const fetchDashboard = async () => {
    try {
      setIsLoading(true)

      const endDate = new Date()
      const startDate = new Date()

      if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 1)
      } else if (period === 'quarter') {
        startDate.setMonth(startDate.getMonth() - 3)
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1)
      }

      const data = await dashboardService.getDashboard(startDate.toISOString(), endDate.toISOString())
      setDashboard(data)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const locale = i18n.language === 'pt-BR' || i18n.language === 'pt-PT' ? 'pt-BR' : 'en-US'
  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6']

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-[#334155] rounded-lg p-3 shadow-lg">
          {label && <p className="font-medium text-[#1f2937] dark:text-[#f9fafb] mb-2">{label}</p>}
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value, locale)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white dark:from-[#0f172a] via-[#f3f4f6]/20 dark:via-[#1e293b]/20 to-white dark:to-[#0f172a] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1f2937] dark:text-[#f9fafb] mb-2">{t('dashboard.title')}</h1>
            <p className="text-[#6b7280] dark:text-[#9ca3af]">{t('dashboard.description')}</p>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-[#334155] rounded-lg p-1">
            <Button
              onClick={() => setPeriod('month')}
              variant={period === 'month' ? 'primary' : 'ghost'}
              size="sm"
              className={period === 'month' ? 'gradient-primary text-white' : ''}
              aria-label="Month"
            >
              {t('dashboard.month')}
            </Button>
            <Button
              onClick={() => setPeriod('quarter')}
              variant={period === 'quarter' ? 'primary' : 'ghost'}
              size="sm"
              className={period === 'quarter' ? 'gradient-primary text-white' : ''}
              aria-label="Quarter"
            >
              {t('dashboard.quarter')}
            </Button>
            <Button
              onClick={() => setPeriod('year')}
              variant={period === 'year' ? 'primary' : 'ghost'}
              size="sm"
              className={period === 'year' ? 'gradient-primary text-white' : ''}
              aria-label="Year"
            >
              {t('dashboard.year')}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Card className="p-8">
            <div className="text-center text-[#6b7280] dark:text-[#9ca3af]">{t('common.loading')}</div>
          </Card>
        ) : !dashboard ? (
          <Card className="p-8">
            <div className="text-center text-[#6b7280] dark:text-[#9ca3af]">{t('dashboard.noData')}</div>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-success/10 dark:bg-success/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                </div>
                <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] mb-1">{t('dashboard.totalIncome')}</p>
                <p className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb]">{formatCurrency(dashboard.totalIncome, locale)}</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-danger/10 dark:bg-danger/20 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-danger" />
                  </div>
                </div>
                <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] mb-1">{t('dashboard.totalExpense')}</p>
                <p className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb]">{formatCurrency(dashboard.totalExpense, locale)}</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] mb-1">{t('dashboard.netBalance')}</p>
                <p className={`text-2xl font-bold ${dashboard.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatCurrency(dashboard.balance, locale)}
                </p>
              </Card>
            </div>

            {dashboard.transactionsByDate && dashboard.transactionsByDate.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[#1f2937] dark:text-[#f9fafb] mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {t('dashboard.incomeVsExpenses')}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboard.transactionsByDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-[#334155]" />
                    <XAxis dataKey="date" stroke="#6b7280" className="dark:stroke-[#9ca3af]" fontSize={12} />
                    <YAxis stroke="#6b7280" className="dark:stroke-[#9ca3af]" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboard.incomeByCategory && dashboard.incomeByCategory.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-[#1f2937] dark:text-[#f9fafb] mb-6">{t('dashboard.incomeByCategory')}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboard.incomeByCategory}
                        dataKey="amount"
                        nameKey="categoryName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.categoryName}: ${formatCurrency(entry.amount, locale)}`}
                      >
                        {dashboard.incomeByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {dashboard.incomeByCategory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-[#1f2937] dark:text-[#f9fafb]">{item.categoryName}</span>
                        </div>
                        <span className="font-medium text-[#1f2937] dark:text-[#f9fafb]">{formatCurrency(item.amount, locale)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {dashboard.expensesByCategory && dashboard.expensesByCategory.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-[#1f2937] dark:text-[#f9fafb] mb-6">{t('dashboard.expensesByCategory')}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboard.expensesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-[#334155]" />
                      <XAxis dataKey="categoryName" stroke="#6b7280" className="dark:stroke-[#9ca3af]" fontSize={12} />
                      <YAxis stroke="#6b7280" className="dark:stroke-[#9ca3af]" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" name="Amount" radius={[8, 8, 0, 0]}>
                        {dashboard.expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {dashboard.expensesByCategory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-[#1f2937] dark:text-[#f9fafb]">{item.categoryName}</span>
                        </div>
                        <span className="font-medium text-[#1f2937] dark:text-[#f9fafb]">{formatCurrency(item.amount, locale)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
