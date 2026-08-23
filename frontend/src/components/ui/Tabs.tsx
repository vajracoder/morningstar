// ============================================================
// MORNINGSTAR — TABS COMPONENT
// ============================================================

import type { ReactNode } from 'react'

export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  badge?: string | number
}

interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export default function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`tabs ${className}`} role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab-item${activeTab === tab.id ? ' active' : ''}`}
          onClick={() => onChange(tab.id)}
          id={`tab-${tab.id}`}
        >
          {tab.icon && <span style={{ marginRight: '0.375rem', display: 'inline-flex', verticalAlign: 'middle' }}>{tab.icon}</span>}
          {tab.label}
          {tab.badge !== undefined && (
            <span style={{
              marginLeft: '0.375rem',
              background: activeTab === tab.id ? 'rgba(34,197,94,0.2)' : 'var(--color-surface-600)',
              color: activeTab === tab.id ? 'var(--color-primary-400)' : 'var(--color-text-muted)',
              fontSize: '0.7rem', fontWeight: 700,
              padding: '0.1rem 0.4rem', borderRadius: 999,
            }}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
