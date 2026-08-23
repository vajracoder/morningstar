// ============================================================
// MORNINGSTAR — TIMELINE COMPONENT
// Shows the farmer's journey stages
// ============================================================

import type { ReactNode } from 'react'

export interface TimelineStep {
  id: string
  label: string
  description?: string
  status: 'done' | 'active' | 'pending'
  icon?: ReactNode
  date?: string
}

interface TimelineProps {
  steps: TimelineStep[]
  orientation?: 'vertical' | 'horizontal'
}

export default function Timeline({ steps, orientation = 'vertical' }: TimelineProps) {
  if (orientation === 'horizontal') {
    return (
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 0,
        overflowX: 'auto', paddingBottom: '0.5rem',
      }}>
        {steps.map((step, idx) => (
          <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', flex: 1, minWidth: 80 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              {/* Connector line left */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '0.75rem' }}>
                <div style={{
                  flex: 1, height: 2,
                  background: idx === 0 ? 'transparent' : step.status === 'pending' ? 'var(--color-border)' : 'var(--color-primary-600)',
                }} />
                {/* Dot */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem',
                  background: step.status === 'done'
                    ? 'var(--color-primary-600)'
                    : step.status === 'active'
                    ? 'var(--color-surface-600)'
                    : 'var(--color-surface-700)',
                  border: step.status === 'active'
                    ? '2px solid var(--color-primary-500)'
                    : step.status === 'done'
                    ? '2px solid var(--color-primary-600)'
                    : '2px solid var(--color-border)',
                  boxShadow: step.status === 'active' ? '0 0 0 4px rgba(34,197,94,0.15)' : 'none',
                  color: step.status === 'done' ? '#fff' : step.status === 'active' ? 'var(--color-primary-400)' : 'var(--color-text-muted)',
                }}>
                  {step.status === 'done' ? '✓' : step.icon || (idx + 1)}
                </div>
                {/* Connector line right */}
                <div style={{
                  flex: 1, height: 2,
                  background: idx === steps.length - 1 ? 'transparent' : step.status === 'done' ? 'var(--color-primary-600)' : 'var(--color-border)',
                }} />
              </div>
              <div style={{ textAlign: 'center', padding: '0 0.25rem' }}>
                <div style={{
                  fontSize: '0.7rem', fontWeight: 600,
                  color: step.status === 'active' ? 'var(--color-primary-400)' : step.status === 'done' ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
                  lineHeight: 1.3,
                }}>
                  {step.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Vertical timeline
  return (
    <div className="timeline">
      {steps.map(step => (
        <div key={step.id} className={`timeline-item ${step.status}`}>
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            gap: '0.75rem',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: 600, fontSize: '0.9rem',
                color: step.status === 'active' ? 'var(--color-primary-400)'
                  : step.status === 'done' ? 'var(--color-text-primary)'
                  : 'var(--color-text-muted)',
              }}>
                {step.label}
              </div>
              {step.description && (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  {step.description}
                </div>
              )}
              {step.date && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  {step.date}
                </div>
              )}
            </div>
            {step.status === 'done' && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Done ✓</span>
            )}
            {step.status === 'active' && (
              <span style={{
                fontSize: '0.7rem', fontWeight: 600,
                background: 'rgba(34,197,94,0.1)',
                color: 'var(--color-primary-400)',
                padding: '0.125rem 0.5rem', borderRadius: 999,
                border: '1px solid rgba(34,197,94,0.2)',
              }}>
                Current
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
