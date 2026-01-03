import { useTranslation } from 'react-i18next'
import { Transaction } from '../services/transactionService'
import { TransactionItem } from './TransactionItem'
import { Card } from '@/app/shared/components/Card'

interface TransactionListProps {
  transactions: Transaction[]
  loading?: boolean
}

export function TransactionList({ transactions, loading }: TransactionListProps) {
  const { t } = useTranslation()
  
  if (loading) {
    return (
      <Card>
        <div className="p-8 text-center text-muted-foreground">{t('transactions.loading')}</div>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center" role="status" aria-live="polite">
          {t('transactions.noTransactions')}
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <ul className="divide-y divide-border" aria-label="Lista de transações" role="list">
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <TransactionItem transaction={transaction} />
          </li>
        ))}
      </ul>
    </Card>
  )
}
