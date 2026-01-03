import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { CategorySummary } from '../services/dashboardService'
import { Card } from '@/app/shared/components/Card'
import { formatCurrency } from '@/app/shared/utils/format'
import { useTranslation } from 'react-i18next'

interface ExpenseChartProps {
  data: CategorySummary[]
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'pt-BR' || i18n.language === 'pt-PT' ? 'pt-BR' : 'en-US'
  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

  if (data.length === 0) {
    return (
      <Card title={t('dashboard.expensesByCategory')}>
        <div className="p-8 text-center text-muted-foreground">No expense data found</div>
      </Card>
    )
  }

  const chartData = data.map((item) => ({
    name: item.categoryName,
    value: item.amount,
  }))

  return (
    <Card title={t('dashboard.expensesByCategory')}>
      <div className="w-full" role="img" aria-label="Gráfico de despesas por categoria">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
