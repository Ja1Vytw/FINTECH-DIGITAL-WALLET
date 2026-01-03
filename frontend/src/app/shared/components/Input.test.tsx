import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('should render with label', () => {
    render(<Input label="Email" id="email" />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('should show error message', () => {
    render(<Input label="Email" id="email" error="Email inválido" />)
    
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('should mark required fields', () => {
    render(<Input label="Email" id="email" required />)
    
    expect(screen.getByText(/\*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-required', 'true')
  })
})

