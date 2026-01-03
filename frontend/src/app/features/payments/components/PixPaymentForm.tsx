import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { paymentService } from '../services/paymentService'
import { Button } from '@/app/shared/components/Button'
import { Input } from '@/app/shared/components/Input'
import { formatCurrency } from '@/app/shared/utils/format'
import { QrCode } from 'lucide-react'

const pixSchema = z.object({
  amount: z.number().min(0.01, 'Valor mínimo é R$ 0,01'),
  pixKey: z.string().min(1, 'Chave PIX é obrigatória'),
  description: z.string().optional(),
})

type PixFormData = z.infer<typeof pixSchema>

interface PixPaymentFormProps {
  onSuccess: (qrCode?: string) => void
  onError: (error: string) => void
}

export function PixPaymentForm({ onSuccess, onError }: PixPaymentFormProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [showQrCode, setShowQrCode] = useState(false)
  const [qrCode, setQrCode] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PixFormData>({
    resolver: zodResolver(pixSchema),
  })

  const amount = watch('amount')

  const onSubmit = async (data: PixFormData) => {
    try {
      setLoading(true)
      const payment = await paymentService.createPayment({
        method: 'PIX',
        amount: data.amount,
        description: data.description,
        pixKey: data.pixKey,
      })
      
      if (qrCode) {
        onSuccess(qrCode)
      } else {
        onSuccess()
      }
    } catch (err: any) {
      onError(err.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateQrCode = async () => {
    try {
      setLoading(true)
      const code = await paymentService.generatePixQrCode(amount || 0)
      setQrCode(code)
      setShowQrCode(true)
    } catch (err: any) {
      onError('Failed to generate QR code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="pixKey" className="block text-sm font-medium text-foreground mb-2">
          {t('payments.pixKey')} <span className="text-destructive">*</span>
        </label>
        <Input
          id="pixKey"
          type="text"
          {...register('pixKey')}
          error={errors.pixKey?.message}
          placeholder={t('payments.pixKeyPlaceholder')}
          className="h-12"
          required
          aria-invalid={errors.pixKey ? 'true' : 'false'}
        />
      </div>

      <div>
        <label htmlFor="pixAmount" className="block text-sm font-medium text-foreground mb-2">
          {t('payments.amount')} <span className="text-destructive">*</span>
        </label>
        <Input
          id="pixAmount"
          type="number"
          step="0.01"
          min="0.01"
          {...register('amount', { valueAsNumber: true })}
          error={errors.amount?.message}
          placeholder="0.00"
          className="h-12"
          required
          aria-invalid={errors.amount ? 'true' : 'false'}
        />
      </div>

      <div>
        <label htmlFor="pixDescription" className="block text-sm font-medium text-foreground mb-2">
          {t('payments.description')}
        </label>
        <Input
          id="pixDescription"
          type="text"
          {...register('description')}
          error={errors.description?.message}
          placeholder={t('payments.descriptionPlaceholder')}
          className="h-12"
        />
      </div>

      {amount && amount > 0 && (
        <div className="bg-accent rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">{t('payments.total')}</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(amount)}
          </p>
        </div>
      )}

      {showQrCode && qrCode && (
        <div className="bg-accent rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">{t('payments.pixQRCode')}</h3>
          <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-border mb-4">
            <QrCode className="w-32 h-32 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground text-center">{t('payments.scanQrCode')}</p>
          <p className="text-xs text-muted-foreground mt-2 font-mono break-all text-center">{qrCode}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 h-12 gradient-primary text-white font-semibold shadow-button hover:shadow-button-hover transition-all"
        >
          {loading ? t('common.loading') : t('payments.confirmPayment')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleGenerateQrCode}
          disabled={loading || !amount}
          className="h-12"
        >
          {t('payments.generateQrCode')}
        </Button>
      </div>
    </form>
  )
}
