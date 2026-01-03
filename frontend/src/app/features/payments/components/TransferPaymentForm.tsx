import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { paymentService } from '../services/paymentService'
import { Button } from '@/app/shared/components/Button'
import { Input } from '@/app/shared/components/Input'
import { formatCurrency } from '@/app/shared/utils/format'

const transferSchema = z.object({
  amount: z.number().min(0.01, 'Valor mínimo é R$ 0,01'),
  bankCode: z.string().min(1, 'Código do banco é obrigatório'),
  bankAgency: z.string().min(1, 'Agência é obrigatória'),
  bankAccount: z.string().min(1, 'Conta é obrigatória'),
  description: z.string().optional(),
})

type TransferFormData = z.infer<typeof transferSchema>

interface TransferPaymentFormProps {
  onSuccess: () => void
  onError: (error: string) => void
}

export function TransferPaymentForm({ onSuccess, onError }: TransferPaymentFormProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  })

  const amount = watch('amount')

  const onSubmit = async (data: TransferFormData) => {
    try {
      setLoading(true)
      await paymentService.createPayment({
        method: 'TRANSFER',
        amount: data.amount,
        description: data.description,
        bankCode: data.bankCode,
        bankAgency: data.bankAgency,
        bankAccount: data.bankAccount,
      })
      onSuccess()
    } catch (err: any) {
      onError(err.response?.data?.message || 'Transfer failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="bankCode" className="block text-sm font-medium text-foreground mb-2">
            {t('payments.bankCode')} <span className="text-destructive">*</span>
          </label>
          <Input
            id="bankCode"
            type="text"
            {...register('bankCode')}
            error={errors.bankCode?.message}
            placeholder="001"
            className="h-12"
            required
            aria-invalid={errors.bankCode ? 'true' : 'false'}
          />
        </div>

        <div>
          <label htmlFor="bankAgency" className="block text-sm font-medium text-foreground mb-2">
            {t('payments.agency')} <span className="text-destructive">*</span>
          </label>
          <Input
            id="bankAgency"
            type="text"
            {...register('bankAgency')}
            error={errors.bankAgency?.message}
            placeholder="0001"
            className="h-12"
            required
            aria-invalid={errors.bankAgency ? 'true' : 'false'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="bankAccount" className="block text-sm font-medium text-foreground mb-2">
          {t('payments.account')} <span className="text-destructive">*</span>
        </label>
        <Input
          id="bankAccount"
          type="text"
          {...register('bankAccount')}
          error={errors.bankAccount?.message}
          placeholder="12345678-9"
          className="h-12"
          required
          aria-invalid={errors.bankAccount ? 'true' : 'false'}
        />
      </div>

      <div>
        <label htmlFor="transferAmount" className="block text-sm font-medium text-foreground mb-2">
          {t('payments.amount')} <span className="text-destructive">*</span>
        </label>
        <Input
          id="transferAmount"
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
        <label htmlFor="transferDescription" className="block text-sm font-medium text-foreground mb-2">
          {t('payments.description')}
        </label>
        <Input
          id="transferDescription"
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
        {loading ? t('common.loading') : t('payments.transfer')}
      </Button>
    </form>
  )
}
