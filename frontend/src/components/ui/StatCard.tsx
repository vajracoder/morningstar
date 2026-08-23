// ============================================================
// MORNINGSTAR — STAT CARD COMPONENT
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
      className="stat-card"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        '--accent': accentColor,
      } as React.CSSProperties}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${accentColor}, transparent)`,
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.06em', color: 'var(--color-text-muted)',
            marginBottom: '0.5rem',
          }}>
            {label}
          </p>
          <div className="price-display" style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.625rem)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 1.1,
          }}>
            {value}
          </div>
          {subValue && (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.375rem' }}>
              {subValue}
            </p>
          )}
          {trendText && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 600,
              color: trend === 'up' ? 'var(--color-success)' : trend === 'down' ? 'var(--color-danger)' : 'var(--color-text-muted)',
            }}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              {trendText}
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, color: accentColor,
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
