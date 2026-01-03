import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PaymentMethod } from '../services/paymentService'
import { PixPaymentForm } from '../components/PixPaymentForm'
import { TransferPaymentForm } from '../components/TransferPaymentForm'
import { BillPaymentForm } from '../components/BillPaymentForm'
import { Card } from '@/app/shared/components/Card'
import { Button } from '@/app/shared/components/Button'
import { Smartphone, Building2, FileText, CheckCircle2, AlertCircle, QrCode } from 'lucide-react'
import { paymentService } from '../services/paymentService'
import { formatCurrency } from '@/app/shared/utils/format'

export function PaymentsPage() {
  const { t } = useTranslation()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [qrCode, setQrCode] = useState('')

  const paymentMethods = [
    {
      method: 'PIX' as PaymentMethod,
      icon: <Smartphone className="w-8 h-8" />,
      title: t('payments.pix'),
      description: t('payments.instantPayment'),
      color: 'from-primary to-primary-dark',
    },
    {
      method: 'TRANSFER' as PaymentMethod,
      icon: <Building2 className="w-8 h-8" />,
      title: t('payments.bankTransfer'),
      description: t('payments.traditionalTransfer'),
      color: 'from-success to-emerald-600',
    },
    {
      method: 'BILL' as PaymentMethod,
      icon: <FileText className="w-8 h-8" />,
      title: t('payments.boleto'),
      description: t('payments.payBillsByBarcode'),
      color: 'from-warning to-orange-600',
    },
  ]

  const resetForm = () => {
    setSelectedMethod(null)
    setSuccess(false)
    setError('')
    setQrCode('')
  }

  const handlePaymentSuccess = (qr?: string) => {
    setSuccess(true)
    if (qr) setQrCode(qr)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white dark:from-[#0f172a] via-[#f3f4f6]/20 dark:via-[#1e293b]/20 to-white dark:to-[#0f172a] p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1f2937] dark:text-[#f9fafb] mb-2">{t('payments.title')}</h1>
        <p className="text-[#6b7280] dark:text-[#9ca3af] mb-8">{t('payments.paymentMethods')}</p>

        {!selectedMethod ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.method}
                onClick={() => setSelectedMethod(method.method)}
                className="bg-white dark:bg-[#1e293b] hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b]/50 border border-[#e5e7eb] dark:border-[#334155] rounded-xl p-6 transition-all hover:shadow-lg text-left group"
                aria-label={method.title}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  {method.icon}
                </div>
                <h3 className="font-semibold text-[#1f2937] dark:text-[#f9fafb] text-lg mb-1">{method.title}</h3>
                <p className="text-sm text-[#6b7280] dark:text-[#9ca3af]">{method.description}</p>
              </button>
            ))}
          </div>
        ) : success ? (
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb] mb-2">{t('payments.paymentSuccess')}</h2>
            <p className="text-[#6b7280] dark:text-[#9ca3af] mb-6">{t('payments.paymentProcessedSuccessfully')}</p>

            {qrCode && (
              <div className="bg-[#f3f4f6] dark:bg-[#1e293b] rounded-lg p-6 mb-6">
                <div className="w-48 h-48 bg-white dark:bg-[#0f172a] rounded-lg mx-auto flex items-center justify-center border-2 border-[#e5e7eb] dark:border-[#334155]">
                  <QrCode className="w-32 h-32 text-[#6b7280] dark:text-[#9ca3af]" />
                </div>
                <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] mt-4">{t('payments.scanQrCode')}</p>
                <p className="text-xs text-[#6b7280] dark:text-[#9ca3af] mt-2 font-mono break-all">{qrCode}</p>
              </div>
            )}

            <Button onClick={resetForm} className="gradient-primary text-white">
              {t('payments.makeAnotherPayment')}
            </Button>
          </Card>
        ) : (
          <Card className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#1f2937] dark:text-[#f9fafb]">
                {selectedMethod === 'PIX'
                  ? t('payments.pix')
                  : selectedMethod === 'TRANSFER'
                    ? t('payments.bankTransfer')
                    : t('payments.boleto')}
              </h2>
              <Button onClick={resetForm} variant="ghost" size="sm" aria-label={t('common.back')}>
                {t('payments.changeMethod')}
              </Button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3" role="alert" aria-live="polite">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {selectedMethod === 'PIX' && (
              <PixPaymentForm onSuccess={handlePaymentSuccess} onError={setError} />
            )}
            {selectedMethod === 'TRANSFER' && (
              <TransferPaymentForm onSuccess={handlePaymentSuccess} onError={setError} />
            )}
            {selectedMethod === 'BILL' && (
              <BillPaymentForm onSuccess={handlePaymentSuccess} onError={setError} />
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
