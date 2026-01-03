import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  title?: string
}

export function Card({ children, title, className = '', ...props }: CardProps) {
  return (
    <div 
      className={`bg-white dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-[#334155] rounded-xl shadow-sm ${className}`.trim()} 
      {...props}
    >
      {title && <h2 className="text-xl font-semibold text-[#1f2937] dark:text-[#f9fafb] mb-4 px-6 pt-6">{title}</h2>}
      <div className={title ? 'px-6 pb-6' : 'p-6'}>{children}</div>
    </div>
  )
}
