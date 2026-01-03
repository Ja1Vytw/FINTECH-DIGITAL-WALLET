import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card } from '@/app/shared/components/Card'
import { formatCurrency } from '@/app/shared/utils/format'
import { useTranslation } from 'react-i18next'

interface CategoryChartProps {
  income: number
  expense: number
}

export function CategoryChart({ income, expense }: CategoryChartProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'pt-BR' || i18n.language === 'pt-PT' ? 'pt-BR' : 'en-US'

  const data = [
    { name: t('transactions.income'), value: income, color: '#10b981' },
    { name: t('transactions.expense'), value: expense, color: '#ef4444' },
  ]

  const total = income + expense

  if (total === 0) {
    return (
      <Card title={t('dashboard.financialSummary')}>
        <div className="p-8 text-center text-[#6b7280] dark:text-[#9ca3af]">{t('dashboard.noData')}</div>
      </Card>
    )
  }

  return (
    <Card title={t('dashboard.financialSummary')}>
      <div className="w-full" role="img" aria-label="Gráfico de resumo financeiro">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value, locale)}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
