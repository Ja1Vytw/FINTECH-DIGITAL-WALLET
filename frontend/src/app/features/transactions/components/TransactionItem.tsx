import { Transaction } from '../services/transactionService'
import { formatCurrency, formatDate } from '@/app/shared/utils/format'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface TransactionItemProps {
  transaction: Transaction
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isIncome = transaction.type === 'INCOME'

  return (
    <div className="p-4 hover:bg-[#f3f4f6]/50 dark:hover:bg-[#1e293b]/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isIncome ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            }`}
          >
            {isIncome ? (
              <ArrowDownRight className="w-5 h-5" />
            ) : (
              <ArrowUpRight className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="font-medium text-[#1f2937] dark:text-[#f9fafb]">
              {transaction.description || transaction.categoryName || (isIncome ? 'Income' : 'Expense')}
            </p>
            <p className="text-sm text-[#6b7280] dark:text-[#9ca3af]">
              {transaction.categoryName && `${transaction.categoryName} • `}
              {formatDate(transaction.createdAt)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${isIncome ? 'text-success' : 'text-danger'}`}>
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>
        </div>
      </div>
    </div>
  )
}
