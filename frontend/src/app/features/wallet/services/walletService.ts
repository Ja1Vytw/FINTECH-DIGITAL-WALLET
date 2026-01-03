import apiClient from '@/app/core/services/apiClient'

export interface Wallet {
  id: number
  userId: number
  balance: number
}

class WalletService {
  async getBalance(): Promise<{ balance: number }> {
    const response = await apiClient.get<Wallet>('/wallet/balance')
    return { balance: response.data.balance }
  }
}

export const walletService = new WalletService()

