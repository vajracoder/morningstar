// ============================================================
// MORNINGSTAR — STAT CARD COMPONENT (Production FinTech Standard)
// ============================================================

import type { ReactNode } from 'react'

type StatTrend = 'up' | 'down' | 'neutral'

interface StatCardProps {
  label: string
  value: string | number
  subValue?: string
  trend?: StatTrend
  trendText?: string
  icon?: ReactNode
  iconBg?: string
  accentColor?: string
  onClick?: () => void
}

export default function StatCard({
  label,
  value,
  subValue,
  trend,
  trendText,
  icon,
  iconBg = 'rgba(34,197,94,0.1)',
  accentColor = 'var(--color-primary-500)',
  onClick,
}: StatCardProps) {
  return (
    <div
      className={`stat-card ${onClick ? 'card-interactive' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-text-muted)',
            marginBottom: '0.375rem',
          }}>
            {label}
          </p>

          <div className="price-display" style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 1.15,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {value}
          </div>

          {subValue && (
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.25rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {subValue}
            </p>
          )}

          {trendText && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginTop: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: trend === 'up' ? 'var(--color-success)' : trend === 'down' ? 'var(--color-danger)' : 'var(--color-text-muted)',
            }}>
              {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : '• '}
              {trendText}
            </div>
          )}
        </div>

        {icon && (
          <div
            className="icon-box-md"
            style={{
              background: iconBg,
              color: accentColor,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
