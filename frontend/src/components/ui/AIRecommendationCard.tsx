// ============================================================
// MORNINGSTAR — AI RECOMMENDATION CARD COMPONENT (FinTech Standard)
// ============================================================

import { useState } from 'react'
import type { SaleRecommendation, Decision } from '@/types'
import {
  Brain, ChevronDown, ChevronUp, Clock, TrendingUp,
  Zap, ArrowRight, ShieldCheck, Warehouse, Scale, Coins
} from 'lucide-react'
import Button from './Button'
import Badge from './Badge'

interface AIRecommendationCardProps {
  recommendation: SaleRecommendation
  onAction?: () => void
}

const DECISION_CONFIG: Record<Decision, {
  label: string; color: string; bg: string; border: string; icon: any
}> = {
  SELL_NOW: {
    label: 'SELL NOW',
    color: '#4ade80',
    bg: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.35)',
    icon: Zap,
  },
  WAIT: {
    label: 'WAIT TO SELL',
    color: '#fbbf24',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    icon: Clock,
  },
  PARTIAL_SELL: {
    label: 'PARTIAL SELL',
    color: '#60a5fa',
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.35)',
    icon: TrendingUp,
  },
}

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export default function AIRecommendationCard({ recommendation, onAction }: AIRecommendationCardProps) {
  const [expanded, setExpanded] = useState(false)
  const cfg = DECISION_CONFIG[recommendation.decision]
  const DecisionIcon = cfg.icon

  const gain = recommendation.net_realisation_recommended - recommendation.net_realisation_current
  const confidencePercent = Math.round(recommendation.confidence * 100)

  return (
    <div
      className="card"
      style={{
        background: `linear-gradient(135deg, ${cfg.bg} 0%, var(--color-surface-800) 65%)`,
        border: `1px solid ${cfg.border}`,
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
      }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            className="icon-box-md"
            style={{
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              color: cfg.color,
            }}
          >
            <Brain size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: cfg.color }}>
              Decision Intelligence Engine
            </div>
            <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.625rem)', fontWeight: 900, margin: '0.15rem 0 0', color: 'var(--color-text-primary)' }}>
              {recommendation.decision === 'WAIT'
                ? `WAIT ${recommendation.recommended_days} DAYS`
                : cfg.label}
            </h2>
          </div>
        </div>

        {/* Confidence Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'var(--color-surface-700)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-pill)',
            padding: '0.35rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
          }}>
            <ShieldCheck size={13} color="#4ade80" />
            <span>{confidencePercent}% Confidence</span>
          </div>
          <Badge variant={recommendation.risk === 'LOW' ? 'success' : recommendation.risk === 'MEDIUM' ? 'warning' : 'danger'}>
            {recommendation.risk} Risk
          </Badge>
        </div>
      </div>

      {/* Primary Financial Benefit Banner */}
      <div style={{
        background: 'var(--color-surface-700)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
            Expected Net Benefit over Immediate Sale
          </div>
          <div className="price-display" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#4ade80' }}>
            +{formatINR(gain)}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
            Target Net Realisation
          </div>
          <div className="price-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {formatINR(recommendation.net_realisation_recommended)}
          </div>
        </div>
      </div>

      {/* Summary Reason */}
      <p style={{
        fontSize: '0.875rem',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.6,
        margin: '0 0 1rem',
      }}>
        {recommendation.reason}
      </p>

      {/* Visual Math Breakdown (Expandable) */}
      {expanded && (
        <div style={{
          background: 'var(--color-surface-900)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>
            Mathematical Calculation Breakdown
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
            fontSize: '0.8rem',
          }}>
            <div style={{ background: 'var(--color-surface-700)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>Projected Market Upside</div>
              <div style={{ fontWeight: 700, color: '#4ade80', marginTop: '0.2rem' }}>
                +{formatINR(gain + recommendation.storage_cost_total)}
              </div>
            </div>

            <div style={{ background: 'var(--color-surface-700)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>Storage Holding Cost</div>
              <div style={{ fontWeight: 700, color: '#f87171', marginTop: '0.2rem' }}>
                -{formatINR(recommendation.storage_cost_total)}
              </div>
            </div>

            <div style={{ background: 'var(--color-surface-700)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>Spoilage Risk Factor</div>
              <div style={{ fontWeight: 700, color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                {recommendation.spoilage_risk_percent}% estimated
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ paddingLeft: 0, color: 'var(--color-text-muted)', fontSize: '0.8rem' }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <><ChevronUp size={15} /> Hide Calculation Math</> : <><ChevronDown size={15} /> How is this calculated?</>}
        </button>

        {onAction && (
          <Button
            variant="primary"
            size="sm"
            onClick={onAction}
            iconRight={<ArrowRight size={15} />}
          >
            Find Matched Buyers
          </Button>
        )}
      </div>
    </div>
  )
}
