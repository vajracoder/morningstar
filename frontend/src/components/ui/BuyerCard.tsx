// ============================================================
// MORNINGSTAR — BUYER CARD COMPONENT
// ============================================================

import type { BuyerMatch } from '@/types'
import { Shield, MapPin, Clock, Star, ChevronRight } from 'lucide-react'
import Badge from './Badge'

interface BuyerCardProps {
  match: BuyerMatch
  rank?: number
  onContact?: (match: BuyerMatch) => void
  onViewProfile?: (match: BuyerMatch) => void
}

const BUYER_TYPE_LABELS: Record<string, string> = {
  processor: 'Food Processor',
  retailer: 'Retailer',
  exporter: 'Exporter',
  fpo: 'FPO',
  individual: 'Individual',
}

export default function BuyerCard({ match, rank, onContact, onViewProfile }: BuyerCardProps) {
  const { buyer, match_score, offered_price, distance_km, payment_reliability, risk_level } = match

  const riskVariant = risk_level === 'LOW' ? 'success' : risk_level === 'MEDIUM' ? 'warning' : 'danger'

  return (
    <div
      className="card"
      style={{
        position: 'relative',
        ...(rank === 1 ? {
          border: '1px solid rgba(34,197,94,0.3)',
          background: 'linear-gradient(135deg, rgba(22,163,74,0.06) 0%, var(--color-surface-800) 60%)',
        } : {}),
      }}
    >
      {/* Best match ribbon */}
      {rank === 1 && (
        <div style={{
          position: 'absolute', top: -1, right: 16,
          background: 'linear-gradient(135deg, #15803d, #22c55e)',
          color: '#fff', fontSize: '0.7rem', fontWeight: 700,
          padding: '0.25rem 0.625rem',
          borderRadius: '0 0 8px 8px', letterSpacing: '0.05em',
        }}>
          ⭐ BEST MATCH
        </div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1rem' }}>
        {/* Avatar */}
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: `hsl(${(buyer.name.charCodeAt(0) * 37) % 360}, 50%, 20%)`,
          border: `1px solid hsl(${(buyer.name.charCodeAt(0) * 37) % 360}, 50%, 30%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '1.125rem',
          color: `hsl(${(buyer.name.charCodeAt(0) * 37) % 360}, 80%, 65%)`,
        }}>
          {buyer.name.charAt(0)}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
              {buyer.name}
            </h4>
            {buyer.verified && (
              <span title="Verified buyer" style={{ display: 'inline-flex' }}>
                <Shield size={13} color="#4ade80" aria-label="Verified buyer" />
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
            {BUYER_TYPE_LABELS[buyer.type] || buyer.type}
          </p>
        </div>

        {/* Match score */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '1.375rem', lineHeight: 1,
            color: match_score >= 90 ? '#4ade80' : match_score >= 75 ? '#fbbf24' : 'var(--color-text-secondary)',
          }}>
            {match_score}%
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>match</div>
        </div>
      </div>

      {/* Info pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <MapPin size={12} /> {buyer.district}, {buyer.state} · {distance_km}km
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <Clock size={12} /> Pays in {buyer.avg_payment_days} days
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <Star size={12} /> {payment_reliability}% reliable
        </div>
      </div>

      {/* Offered price + risk badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        {offered_price ? (
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.125rem' }}>Offered Price</div>
            <div className="price-display" style={{ fontSize: '1.375rem', fontWeight: 800, color: '#4ade80' }}>
              ₹{offered_price.toLocaleString('en-IN')}/q
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Price on negotiation</div>
        )}
        <Badge variant={riskVariant}>{risk_level} Risk</Badge>
      </div>

      {/* Trust bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
          <span>Trust Score</span>
          <span>{buyer.trust_score}/100</span>
        </div>
        <div style={{ height: 4, background: 'var(--color-surface-600)', borderRadius: 999 }}>
          <div style={{
            height: '100%', borderRadius: 999,
            width: `${buyer.trust_score}%`,
            background: buyer.trust_score >= 90 ? '#22c55e' : buyer.trust_score >= 70 ? '#f59e0b' : '#ef4444',
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.625rem' }}>
        {onContact && (
          <button
            className="btn btn-primary"
            style={{ flex: 1, fontSize: '0.8rem' }}
            onClick={() => onContact(match)}
          >
            Contact Buyer
          </button>
        )}
        {onViewProfile && (
          <button
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem 0.75rem' }}
            onClick={() => onViewProfile(match)}
            aria-label="View buyer profile"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
