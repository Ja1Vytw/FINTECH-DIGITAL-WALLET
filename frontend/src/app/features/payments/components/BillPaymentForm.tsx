import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { paymentService } from '../services/paymentService'
import { Button } from '@/app/shared/components/Button'
import { Input } from '@/app/shared/components/Input'
import { formatCurrency } from '@/app/shared/utils/format'

const billSchema = z.object({
  amount: z.number().min(0.01, 'Valor mínimo é R$ 0,01'),
  billCode: z.string().min(47, 'Código de barras deve ter 47 dígitos').max(47),
  description: z.string().optional(),
})

type BillFormData = z.infer<typeof billSchema>

interface BillPaymentFormProps {
  onSuccess: () => void
  onError: (error: string) => void
}

export function BillPaymentForm({ onSuccess, onError }: BillPaymentFormProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BillFormData>({
    resolver: zodResolver(billSchema),
  })

  const amount = watch('amount')

  const onSubmit = async (data: BillFormData) => {
    try {
      setLoading(true)
      await paymentService.createPayment({
        method: 'BILL',
        amount: data.amount,
        description: data.description,
        billCode: data.billCode,
      })
      onSuccess()
    } catch (err: any) {
      onError(err.response?.data?.message || 'Bill payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="billCode" className="block text-sm font-medium text-foreground mb-2">
          {t('payments.barcode')} <span className="text-destructive">*</span>
        </label>
        <Input
          id="billCode"
          type="text"
          {...register('billCode')}
          error={errors.billCode?.message}
          placeholder={t('payments.barcodePlaceholder')}
          className="h-12 font-mono text-sm"
          maxLength={47}
          required
          aria-invalid={errors.billCode ? 'true' : 'false'}
        />
      </div>

      <div>
        <label htmlFor="billAmount" className="block text-sm font-medium text-foreground mb-2">
          {t('payments.amount')} <span className="text-destructive">*</span>
        </label>
        <Input
          id="billAmount"
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
        <label htmlFor="billDescription" className="block text-sm font-medium text-foreground mb-2">
          {t('payments.description')}
        </label>
        <Input
          id="billDescription"
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

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 gradient-primary text-white font-semibold shadow-button hover:shadow-button-hover transition-all"
      >
        {loading ? t('common.loading') : t('payments.confirmPayment')}
      </Button>
    </form>
  )
}
