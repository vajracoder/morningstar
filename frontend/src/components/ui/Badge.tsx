// ============================================================
// MORNINGSTAR — BADGE COMPONENT
// ============================================================

import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  icon?: ReactNode
  className?: string
}

export default function Badge({ variant = 'neutral', children, icon, className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {icon && icon}
      {children}
    </span>
  )
}
