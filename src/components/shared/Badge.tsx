import type { ValidationSeverity } from '../../types/validation'

interface BadgeProps {
  variant: ValidationSeverity | 'pass' | 'neutral'
  children: React.ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<string, string> = {
  pass: 'bg-green-100 text-green-800 border border-green-200',
  error: 'bg-red-100 text-red-800 border border-red-200',
  warning: 'bg-amber-100 text-amber-800 border border-amber-200',
  info: 'bg-blue-100 text-blue-800 border border-blue-200',
  neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.neutral} ${className}`}
    >
      {children}
    </span>
  )
}
