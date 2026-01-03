import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary-gradient text-white hover:shadow-button-hover active:translate-y-0',
    secondary: 'bg-[#f9fafb] dark:bg-[#1e293b] text-[#1f2937] dark:text-[#f9fafb] border border-[#e5e7eb] dark:border-[#334155] hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b]/50',
    ghost: 'bg-transparent text-[#1f2937] dark:text-[#f9fafb] hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b]',
    outline: 'bg-transparent text-[#1f2937] dark:text-[#f9fafb] border-2 border-[#e5e7eb] dark:border-[#334155] hover:border-primary',
    danger: 'bg-danger text-white hover:bg-red-600',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl',
    icon: 'p-2 rounded-lg',
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()
  
  return (
    <button
      className={classes}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
