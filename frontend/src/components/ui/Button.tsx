// ============================================================
// MORNINGSTAR — BUTTON COMPONENT
// ============================================================

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  block?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  block = false,
  icon,
  iconRight,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    block ? 'btn-block' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {loading ? (
        <span className="loading-spinner" style={{ width: size === 'sm' ? 14 : 18, height: size === 'sm' ? 14 : 18, borderWidth: 2 }} />
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  )
}
