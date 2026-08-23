// ============================================================
// MORNINGSTAR — OFFER CARD COMPONENT
// Displays an Offer with price, quantity, status badge, expiry,
// and action buttons for Accept / Counter / Reject.
// ============================================================

import type { Offer } from '@/types'
import {
  Clock,
  HandshakeIcon,
  ArrowLeftRight,
  XCircle,
  IndianRupee,
  Package,
} from 'lucide-react'
import Badge from './Badge'
import Button from './Button'

interface OfferCardProps {
  offer: Offer
  /** Name of the counterparty to display */
  counterpartyName?: string
  /** Perspective — shows actions relevant to this role */
  perspective?: 'farmer' | 'buyer'
  onAccept?: (offer: Offer) => void
  onCounter?: (offer: Offer) => void
  onReject?: (offer: Offer) => void
  /** Custom extra content below the actions */
  footer?: React.ReactNode
}

const STATUS_CONFIG: Record<
  Offer['status'],
  { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }
> = {
  pending:        { label: 'Pending',        variant: 'warning'  },
  counter_offered:{ label: 'Counter Offered', variant: 'info'    },
  accepted:       { label: 'Accepted',        variant: 'success'  },
  rejected:       { label: 'Rejected',        variant: 'danger'   },
  expired:        { label: 'Expired',         variant: 'neutral'  },
}

function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

function formatExpiry(expiresAt?: string) {
  if (!expiresAt) return null
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 1) return `Expires in <1h`
  if (hours < 24) return `Expires in ${hours}h`
  return `Expires in ${Math.floor(hours / 24)}d`
}

export default function OfferCard({
  offer,
  counterpartyName,
  perspective = 'farmer',
  onAccept,
  onCounter,
  onReject,
  footer,
}: OfferCardProps) {
  const { label: statusLabel, variant: statusVariant } = STATUS_CONFIG[offer.status]
  const expiryText = formatExpiry(offer.expires_at)

  const isActionable = offer.status === 'pending' || offer.status === 'counter_offered'
  // Farmer can act when buyer initiated or counter_offered; buyer vice versa
  const canAct = isActionable && (
    (perspective === 'farmer' && (offer.initiated_by === 'buyer' || offer.status === 'counter_offered'))
    || (perspective === 'buyer' && (offer.initiated_by === 'farmer' || offer.status === 'counter_offered'))
  )

  return (
    <div
      className="card"
      style={{
        position: 'relative',
        ...(offer.status === 'accepted' ? {
          border: '1px solid rgba(34,197,94,0.3)',
          background: 'linear-gradient(135deg, rgba(22,163,74,0.06) 0%, var(--color-surface-800) 70%)',
        } : {}),
        ...(offer.status === 'rejected' || offer.status === 'expired' ? {
          opacity: 0.65,
        } : {}),
      }}
    >
      {/* Status strip */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 3,
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          background:
            offer.status === 'accepted'    ? 'var(--color-success)' :
            offer.status === 'pending'     ? 'var(--color-warning)' :
            offer.status === 'counter_offered' ? 'var(--color-info)' :
            offer.status === 'rejected'    ? 'var(--color-danger)'  :
            'var(--color-surface-400)',
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', paddingTop: '0.25rem' }}>
        <div>
          {counterpartyName && (
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
              {offer.initiated_by === perspective ? 'Sent to' : 'Offer from'}
            </p>
          )}
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
            {counterpartyName ?? (offer.initiated_by === 'buyer' ? 'Buyer' : 'You')}
          </h4>
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      {/* Price & Quantity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
        background: 'var(--color-surface-700)',
        borderRadius: 'var(--radius-md)',
        padding: '0.875rem',
        marginBottom: '1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
            <IndianRupee size={10} /> Price / Quintal
          </div>
          <div className="price-display" style={{ fontSize: '1.375rem', fontWeight: 800, color: '#4ade80' }}>
            {formatINR(offer.price_per_quintal)}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
            <Package size={10} /> Quantity
          </div>
          <div className="price-display" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {offer.quantity_quintal}q
          </div>
        </div>
      </div>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Total Deal Value</span>
        <span className="price-display" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          {formatINR(offer.total_amount)}
        </span>
      </div>

      {/* Expiry */}
      {expiryText && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          fontSize: '0.75rem',
          color: expiryText === 'Expired' ? 'var(--color-danger)' : 'var(--color-text-muted)',
          marginBottom: '0.875rem',
        }}>
          <Clock size={12} />
          {expiryText}
        </div>
      )}

      {/* Notes */}
      {offer.notes && (
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
          padding: '0.625rem 0.75rem',
          background: 'var(--color-surface-700)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1rem',
          border: '1px solid var(--color-border)',
        }}>
          "{offer.notes}"
        </p>
      )}

      {/* Actions */}
      {canAct && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {onAccept && (
            <Button
              variant="primary"
              size="sm"
              icon={<HandshakeIcon size={14} />}
              onClick={() => onAccept(offer)}
              style={{ flex: 1 }}
            >
              Accept
            </Button>
          )}
          {onCounter && (
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowLeftRight size={14} />}
              onClick={() => onCounter(offer)}
              style={{ flex: 1 }}
            >
              Counter
            </Button>
          )}
          {onReject && (
            <Button
              variant="ghost"
              size="sm"
              icon={<XCircle size={14} />}
              onClick={() => onReject(offer)}
              style={{ color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.2)' }}
            >
              Reject
            </Button>
          )}
        </div>
      )}

      {footer}
    </div>
  )
}
