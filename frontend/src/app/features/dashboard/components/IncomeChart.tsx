import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CategorySummary } from '../services/dashboardService'
import { Card } from '@/app/shared/components/Card'
import { formatCurrency } from '@/app/shared/utils/format'
import { useTranslation } from 'react-i18next'

interface IncomeChartProps {
  data: CategorySummary[]
}

export function IncomeChart({ data }: IncomeChartProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'pt-BR' || i18n.language === 'pt-PT' ? 'pt-BR' : 'en-US'

  if (data.length === 0) {
    return (
      <Card title={t('dashboard.incomeByCategory')}>
        <div className="p-8 text-center text-muted-foreground">No income data found</div>
      </Card>
    )
  }

  const chartData = data.map((item) => ({
    name: item.categoryName,
    valor: item.amount,
  }))

  return (
    <Card title={t('dashboard.incomeByCategory')}>
      <div className="w-full" role="img" aria-label="Gráfico de receitas por categoria">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value, locale)}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value, locale)}
            />
            <Legend />
            <Bar dataKey="valor" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
