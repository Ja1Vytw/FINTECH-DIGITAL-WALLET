import apiClient from '@/app/core/services/apiClient'

export interface CategorySummary {
  categoryName: string
  amount: number
}

export interface Dashboard {
  totalIncome: number
  totalExpense: number
  balance: number
  expensesByCategory: CategorySummary[]
  incomeByCategory: CategorySummary[]
  transactionsByDate: Array<{ date: string; income: number; expense: number }>
}

class DashboardService {
  async getDashboard(startDate?: string, endDate?: string): Promise<Dashboard> {
    const response = await apiClient.get<Dashboard>('/dashboard', {
      params: {
        startDate,
        endDate,
      },
    })
    return response.data
  }
}

export const dashboardService = new DashboardService()

