import apiClient from '@/app/core/services/apiClient'

export type PaymentMethod = 'PIX' | 'TRANSFER' | 'BILL' | 'CARD'

export interface Payment {
  id: number
  amount: number
  method: PaymentMethod
  description?: string
  status: string
  createdAt: string
}

export interface CreatePaymentDTO {
  method: PaymentMethod
  amount: number
  description?: string
  pixKey?: string
  bankAccount?: string
  bankAgency?: string
  bankCode?: string
  billCode?: string
}

class PaymentService {
  async createPayment(data: CreatePaymentDTO): Promise<Payment> {
    const response = await apiClient.post<Payment>('/payments', data)
    return response.data
  }

  async getPayments(): Promise<Payment[]> {
    const response = await apiClient.get<Payment[]>('/payments')
    return response.data
  }

  async generatePixQrCode(amount: number, description?: string): Promise<string> {
    const response = await apiClient.post<{ qrCode: string }>('/payments/pix/qrcode', {
      amount,
      description,
    })
    return response.data.qrCode
  }
}

export const paymentService = new PaymentService()

