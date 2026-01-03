import apiClient from '@/app/core/services/apiClient'

export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Transaction {
  id: number
  walletId: number
  type: TransactionType
  amount: number
  description?: string
  categoryId?: number
  categoryName?: string
  createdAt: string
}

export interface Category {
  id: number
  name: string
  type: TransactionType
  color?: string
  icon?: string
}

export interface CreateTransactionDTO {
  type: TransactionType
  amount: number
  description?: string
  categoryId?: number
}

class TransactionService {
  async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    const response = await apiClient.post<Transaction>('/transactions', data)
    return response.data
  }

  async getTransactions(params?: {
    type?: TransactionType
    categoryId?: number
    startDate?: string
    endDate?: string
    limit?: number
  }): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>('/transactions', { params })
    let transactions = response.data
    if (params?.limit) {
      transactions = transactions.slice(0, params.limit)
    }
    return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getCategories(type?: TransactionType): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories', {
      params: type ? { type } : undefined,
    })
    return response.data
  }
}

export const transactionService = new TransactionService()

