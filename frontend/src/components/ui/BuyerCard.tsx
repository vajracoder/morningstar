// ============================================================
// MORNINGSTAR — BUYER CARD COMPONENT (FinTech Standard)
// ============================================================

import type { BuyerMatch, BuyerType } from '@/types'
import {
  ShieldCheck, MapPin, Clock, Star, ChevronRight,
  Building2, Ship, Store, Users, ArrowRight
} from 'lucide-react'
import Badge from './Badge'
import Button from './Button'

interface BuyerCardProps {
  match: BuyerMatch
  rank?: number
  onContact?: (match: BuyerMatch) => void
  onViewProfile?: (match: BuyerMatch) => void
}

const BUYER_TYPE_CONFIG: Record<BuyerType, { label: string; icon: any; color: string; bg: string }> = {
  processor:  { label: 'Food Processor', icon: Building2, color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
  exporter:   { label: 'Commodity Exporter', icon: Ship, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
  retailer:   { label: 'Retail Chain', icon: Store, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  fpo:        { label: 'Farmer Producer Org', icon: Users, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)' },
  individual: { label: 'Private Trader', icon: Users, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)' },
}

export default function BuyerCard({ match, rank, onContact, onViewProfile }: BuyerCardProps) {
  const { buyer, match_score, offered_price, distance_km, payment_reliability, risk_level } = match

  const typeConfig = BUYER_TYPE_CONFIG[buyer.type] || BUYER_TYPE_CONFIG.processor
  const TypeIcon = typeConfig.icon
  const riskVariant = risk_level === 'LOW' ? 'success' : risk_level === 'MEDIUM' ? 'warning' : 'danger'

  return (
    <div
      className={`card ${rank === 1 ? 'card-hero' : ''}`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      {/* Best Match Ribbon */}
      {rank === 1 && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 16,
          background: 'var(--color-primary-600)',
          color: '#fff',
          fontSize: '0.6875rem',
          fontWeight: 800,
          padding: '0.2rem 0.625rem',
          borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
          letterSpacing: '0.05em',
        }}>
          ⭐ TOP MATCH
        </div>
      )}

      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '0.875rem' }}>
          <div
            className="icon-box-lg"
            style={{
              background: typeConfig.bg,
              border: `1px solid ${typeConfig.color}30`,
              color: typeConfig.color,
            }}
          >
            <TypeIcon size={24} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                {buyer.name}
              </h4>
              {buyer.verified && (
                <span title="Verified Institutional Buyer" style={{ display: 'inline-flex' }}>
                  <ShieldCheck size={15} color="#4ade80" aria-label="Verified buyer" />
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
              {typeConfig.label}
            </p>
          </div>

          {/* Match Score */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div
              className="price-display"
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                lineHeight: 1,
                color: match_score >= 90 ? '#4ade80' : match_score >= 75 ? '#fbbf24' : 'var(--color-text-secondary)',
              }}
            >
              {match_score}%
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>MATCH</div>
          </div>
        </div>

        {/* Location & Payment Terms */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            fontSize: '0.75rem', color: 'var(--color-text-muted)',
            background: 'var(--color-surface-700)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-xs)',
          }}>
            <MapPin size={12} /> {buyer.district}, {buyer.state} ({distance_km}km)
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            fontSize: '0.75rem', color: 'var(--color-text-muted)',
            background: 'var(--color-surface-700)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-xs)',
          }}>
            <Clock size={12} /> Avg {buyer.avg_payment_days}d payout
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            fontSize: '0.75rem', color: 'var(--color-text-muted)',
            background: 'var(--color-surface-700)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-xs)',
          }}>
            <Star size={12} /> {payment_reliability}% on-time
          </span>
        </div>

        {/* Offered Price Strip */}
        <div style={{
          background: 'var(--color-surface-700)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Offered Benchmark</div>
            <div className="price-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ade80' }}>
              {offered_price ? `₹${offered_price.toLocaleString('en-IN')}/q` : 'Open Negotiation'}
            </div>
          </div>
          <Badge variant={riskVariant}>{risk_level} Risk</Badge>
        </div>

        {/* Trust Score Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
            <span>Institutional Trust Score</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{buyer.trust_score}/100</span>
          </div>
          <div style={{ height: 4, background: 'var(--color-surface-600)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              borderRadius: 'var(--radius-pill)',
              width: `${buyer.trust_score}%`,
              background: buyer.trust_score >= 90 ? '#22c55e' : buyer.trust_score >= 70 ? '#f59e0b' : '#ef4444',
            }} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        {onContact && (
          <Button
            variant="primary"
            size="sm"
            style={{ flex: 1 }}
            onClick={() => onContact(match)}
          >
            Initiate Deal Proposal
          </Button>
        )}
        {onViewProfile && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewProfile(match)}
            aria-label="View buyer details"
          >
            <ChevronRight size={16} />
          </Button>
        )}
      </div>
    </div>
  )
}
