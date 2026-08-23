// ============================================================
// MORNINGSTAR — AI RECOMMENDATION CARD COMPONENT
// The most important UI element — makes the decision crystal clear.
// ============================================================

import { useState } from 'react'
import type { SaleRecommendation, Decision } from '@/types'
import { Brain, ChevronDown, ChevronUp, Clock, TrendingUp, AlertTriangle, Zap } from 'lucide-react'

interface AIRecommendationCardProps {
  recommendation: SaleRecommendation
  onAction?: () => void
}

const DECISION_CONFIG: Record<Decision, {
  label: string; color: string; bg: string; border: string; icon: typeof Zap
}> = {
  SELL_NOW: {
    label: 'SELL NOW',
    color: '#4ade80',
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.3)',
    icon: Zap,
  },
  WAIT: {
    label: `WAIT`,
    color: '#fbbf24',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    icon: Clock,
  },
  PARTIAL_SELL: {
    label: 'PARTIAL SELL',
    color: '#60a5fa',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
    icon: TrendingUp,
  },
}

function formatCurrency(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n.toLocaleString('en-IN')}`
}

export default function AIRecommendationCard({ recommendation, onAction }: AIRecommendationCardProps) {
  const [expanded, setExpanded] = useState(false)
  const cfg = DECISION_CONFIG[recommendation.decision]
  const DecisionIcon = cfg.icon

  const gain = recommendation.net_realisation_recommended - recommendation.net_realisation_current

  return (
    <div style={{
      background: `linear-gradient(135deg, ${cfg.bg} 0%, rgba(15,22,41,0.98) 60%)`,
      border: `1px solid ${cfg.border}`,
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 0 40px ${cfg.bg}, var(--shadow-lg)`,
    }}
      className="animate-fade-in"
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at top left, ${cfg.bg} 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem', position: 'relative' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Brain size={18} color={cfg.color} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            AI Recommendation
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
            Confidence {Math.round(recommendation.confidence * 100)}%
          </div>
        </div>
        {/* Confidence pill */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{
            background: 'var(--color-surface-700)', borderRadius: 999,
            padding: '0.25rem 0.625rem', display: 'flex', alignItems: 'center', gap: '0.375rem',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: recommendation.confidence > 0.75 ? '#4ade80' : recommendation.confidence > 0.5 ? '#fbbf24' : '#f87171',
            }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              {Math.round(recommendation.confidence * 100)}% sure
            </span>
          </div>
        </div>
      </div>

      {/* Main Decision */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 6vw, 2.75rem)',
              fontWeight: 900,
              color: cfg.color,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              textShadow: `0 0 30px ${cfg.color}40`,
            }}>
              {recommendation.decision === 'WAIT'
                ? `WAIT ${recommendation.recommended_days} DAYS`
                : cfg.label}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.375rem' }}>
              {recommendation.reason}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}>
        {[
          {
            label: 'Expected Gain',
            value: formatCurrency(recommendation.expected_gain),
            color: '#4ade80',
            icon: '↑',
          },
          {
            label: 'Storage Cost',
            value: formatCurrency(recommendation.storage_cost_total),
            color: 'var(--color-text-secondary)',
            icon: '📦',
          },
          {
            label: 'Spoilage Risk',
            value: `${recommendation.spoilage_risk_percent}%`,
            color: recommendation.spoilage_risk_percent > 5 ? '#f87171' : '#fbbf24',
            icon: '⚠',
          },
        ].map(m => (
          <div key={m.label} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{m.icon}</div>
            <div style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', fontWeight: 800, color: m.color, fontFamily: 'var(--font-display)' }}>
              {m.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Net Realisation Comparison */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 'var(--radius-md)',
        padding: '0.875rem 1rem',
        marginBottom: '1rem',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Sell Today</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
            ₹{recommendation.net_realisation_current.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{
          background: 'rgba(34,197,94,0.15)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 8,
          padding: '0.375rem 0.75rem',
          fontSize: '0.875rem', fontWeight: 700, color: '#4ade80',
        }}>
          +{formatCurrency(gain)}
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
            Sell in {recommendation.recommended_days} days
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem', color: '#4ade80' }}>
            ₹{recommendation.net_realisation_recommended.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Why section (expandable) */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', background: 'transparent', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.375rem', cursor: 'pointer', padding: '0.5rem',
          color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 500,
          borderRadius: 'var(--radius-sm)',
          transition: 'color 150ms',
        }}
      >
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {expanded ? 'Hide details' : 'Why this recommendation?'}
      </button>

      {expanded && (
        <div className="animate-fade-in" style={{
          marginTop: '0.75rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 'var(--radius-md)',
          padding: '0.875rem 1rem',
          fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={14} style={{ color: '#fbbf24', flexShrink: 0, marginTop: 3 }} />
            <span>Risk Level: <strong style={{ color: recommendation.risk === 'LOW' ? '#4ade80' : recommendation.risk === 'MEDIUM' ? '#fbbf24' : '#f87171' }}>{recommendation.risk}</strong></span>
          </div>
          <p>{recommendation.reason}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Generated at {new Date(recommendation.generated_at).toLocaleString('en-IN')}
          </p>
        </div>
      )}

      {/* CTA */}
      {onAction && (
        <button
          className="btn btn-primary btn-block"
          style={{ marginTop: '1rem' }}
          onClick={onAction}
        >
          <DecisionIcon size={16} />
          {recommendation.decision === 'SELL_NOW' ? 'Find Buyers Now' : `Set Alert for ${recommendation.recommended_days} Days`}
        </button>
      )}
    </div>
  )
}
