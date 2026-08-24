// ============================================================
// MORNINGSTAR — EMPTY STATE COMPONENT
// ============================================================

import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && (
        <div style={{
          width: 56, height: 56,
          background: 'var(--color-surface-700)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '0.25rem',
          color: 'var(--color-text-muted)',
        }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{title}</h3>
      {description && <p style={{ fontSize: '0.875rem', maxWidth: 300 }}>{description}</p>}
      {action && <div style={{ marginTop: '0.5rem' }}>{action}</div>}
    </div>
  )
}
