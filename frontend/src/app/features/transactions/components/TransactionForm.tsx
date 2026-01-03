import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/shared/components/Button'
import { Input } from '@/app/shared/components/Input'
import { transactionService, Category, TransactionType } from '../services/transactionService'
import { DollarSign, FileText, ArrowUp, ArrowDown, AlertCircle, CheckCircle2 } from 'lucide-react'

const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().positive('Valor deve ser maior que zero'),
  description: z.string().optional(),
  categoryId: z.number().optional(),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  onSuccess?: () => void
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'EXPENSE',
    },
  })

  const selectedType = watch('type')

  useEffect(() => {
    loadCategories(selectedType)
  }, [selectedType])

  const loadCategories = async (type: TransactionType) => {
    try {
      const data = await transactionService.getCategories(type)
      setCategories(data)
    } catch (err) {
    }
  }

  const onSubmit = async (data: TransactionFormData) => {
    setError(null)
    setLoading(true)

    try {
      await transactionService.createTransaction(data)
      setFormSuccess(true)
      reset()
      setTimeout(() => {
        setFormSuccess(false)
        onSuccess?.()
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate aria-label="Formulário de transação">
      {formSuccess && (
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3" role="alert" aria-live="polite">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <p className="text-sm text-success">{t('transactions.createdSuccessfully')}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3" role="alert" aria-live="polite">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('transactions.type')} <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              reset({ ...watch(), type: 'INCOME' })
            }}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedType === 'INCOME'
                ? 'border-success bg-success/10 text-success'
                : 'border-border bg-card text-muted-foreground hover:border-success/50'
            }`}
            aria-label={t('transactions.income')}
            aria-pressed={selectedType === 'INCOME'}
          >
            <ArrowDown className="w-6 h-6 mx-auto mb-2" />
            <span className="font-medium">{t('transactions.income')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              reset({ ...watch(), type: 'EXPENSE' })
            }}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedType === 'EXPENSE'
                ? 'border-danger bg-danger/10 text-danger'
                : 'border-border bg-card text-muted-foreground hover:border-danger/50'
            }`}
            aria-label={t('transactions.expense')}
            aria-pressed={selectedType === 'EXPENSE'}
          >
            <ArrowUp className="w-6 h-6 mx-auto mb-2" />
            <span className="font-medium">{t('transactions.expense')}</span>
          </button>
        </div>
        <input type="hidden" {...register('type')} />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
          {t('payments.amount')} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            {...register('amount', { valueAsNumber: true })}
            error={errors.amount?.message}
            placeholder="0.00"
            className="pl-10 h-12"
            required
            aria-invalid={errors.amount ? 'true' : 'false'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
          {t('transactions.category')}
        </label>
        <select
          id="category"
          {...register('categoryId', { valueAsNumber: true })}
          className="w-full h-12 px-4 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          aria-label={t('transactions.category')}
        >
          <option value="">{t('transactions.selectCategory')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
          {t('payments.description')}
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="description"
            type="text"
            {...register('description')}
            error={errors.description?.message}
            placeholder={t('transactions.descriptionPlaceholder')}
            className="pl-10 h-12"
            aria-invalid={errors.description ? 'true' : 'false'}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || formSuccess}
        className="w-full h-12 gradient-primary text-white font-semibold shadow-button hover:shadow-button-hover transition-all"
        aria-label="Create transaction"
      >
        {loading ? t('transactions.creating') : t('transactions.createTransaction')}
      </Button>
    </form>
  )
}
