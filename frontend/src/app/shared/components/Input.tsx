import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, id, className = '', ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || 'input'}`
    const errorId = error ? `${inputId}-error` : undefined
    
    const inputClasses = `w-full px-4 py-3 rounded-lg border-2 ${
      error ? 'border-danger' : 'border-[#e5e7eb] dark:border-[#334155]'
    } bg-white dark:bg-[#0f172a] text-[#1f2937] dark:text-[#f9fafb] placeholder:text-[#6b7280] dark:placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
      className
    }`.trim()
    
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1f2937] dark:text-[#f9fafb]">
            {label}
            {required && <span className="text-danger ml-1" aria-label="obrigatório">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          aria-required={required}
          {...props}
        />
        {error && (
          <span id={errorId} className="text-sm text-danger mt-1" role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
