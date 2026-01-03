import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TransactionForm } from './TransactionForm'
import { transactionService } from '../services/transactionService'

vi.mock('../services/transactionService')

describe('TransactionForm', () => {
  it('should render form fields', () => {
    render(<TransactionForm />)
    
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/valor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    const user = userEvent.setup()
    render(<TransactionForm />)
    
    const submitButton = screen.getByRole('button', { name: /criar transação/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/valor deve ser maior que zero/i)).toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    vi.mocked(transactionService.createTransaction).mockResolvedValue({
      id: 1,
      walletId: 1,
      type: 'EXPENSE',
      amount: 50,
      createdAt: new Date().toISOString(),
    })
    
    render(<TransactionForm onSuccess={onSuccess} />)
    
    await user.type(screen.getByLabelText(/valor/i), '50')
    await user.type(screen.getByLabelText(/descrição/i), 'Test transaction')
    
    const submitButton = screen.getByRole('button', { name: /criar transação/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(transactionService.createTransaction).toHaveBeenCalled()
    })
  })
})

