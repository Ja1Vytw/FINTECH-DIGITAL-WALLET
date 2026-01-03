import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BalanceCard } from './BalanceCard'

describe('BalanceCard', () => {
  it('should format balance as currency', () => {
    render(<BalanceCard balance={1234.56} />)
    
    expect(screen.getByText(/R\$/i)).toBeInTheDocument()
    expect(screen.getByText(/1.234,56/i)).toBeInTheDocument()
  })

  it('should display balance label', () => {
    render(<BalanceCard balance={100} />)
    
    expect(screen.getByText(/saldo atual/i)).toBeInTheDocument()
  })

  it('should have accessible label', () => {
    render(<BalanceCard balance={500} />)
    
    const balanceElement = screen.getByLabelText(/saldo:/i)
    expect(balanceElement).toBeInTheDocument()
  })
})

