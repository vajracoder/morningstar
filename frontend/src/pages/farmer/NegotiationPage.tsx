// ============================================================
// MORNINGSTAR — NEGOTIATION PAGE
// Interactive counter-offer thread, live deal acceptance,
// and digital contract transition
// ============================================================

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, IndianRupee,
  ArrowLeftRight, MessageSquare
} from 'lucide-react'
import {
  acceptOffer, counterOffer, rejectOffer
} from '@/api/offers'
import { MOCK_OFFER } from '@/mock/data'
import {
  Button, OfferCard, Input, useToast
} from '@/components/ui'
import type { Offer } from '@/types'

export default function NegotiationPage() {
  const { offerId } = useParams<{ offerId: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [offer, setOffer] = useState<Offer>(MOCK_OFFER)
  const [counterPrice, setCounterPrice] = useState<number>(MOCK_OFFER.price_per_quintal)
  const [counterMessage, setCounterMessage] = useState<string>('')
  const [actionLoading, setActionLoading] = useState(false)

  // Counter history simulation
  const [history, setHistory] = useState([
    {
      id: 'round-1',
      by: 'buyer' as const,
      price: 2580,
      quantity: 100,
      total: 258000,
      message: 'Initial proposal for Lok-1 Grade A wheat.',
      time: 'Yesterday at 02:30 PM',
    },
    {
      id: 'round-2',
      by: 'farmer' as const,
      price: 2620,
      quantity: 100,
      total: 262000,
      message: 'Can supply within 48 hours. Asking ₹2,620 for moisture < 12%.',
      time: 'Yesterday at 04:15 PM',
    },
    {
      id: 'round-3',
      by: 'buyer' as const,
      price: 2600,
      quantity: 100,
      total: 260000,
      message: 'Agreed on ₹2,600/q final rate. Ready to sign digital contract.',
      time: 'Today at 09:00 AM',
    },
  ])

  const handleAccept = async () => {
    setActionLoading(true)
    try {
      const updated = await acceptOffer(offer.id)
      setOffer(updated)
      toast.success('Deal Accepted!', 'Contract generated. Redirecting to transaction tracker...')
      setTimeout(() => {
        navigate('/transactions')
      }, 1200)
    } catch (err: any) {
      toast.error('Failed to accept offer', err?.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCounter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!counterPrice || counterPrice <= 0) return

    setActionLoading(true)
    try {
      const updated = await counterOffer(offer.id, counterPrice)
      setOffer(updated)

      setHistory(prev => [
        ...prev,
        {
          id: `round-${prev.length + 1}`,
          by: 'farmer',
          price: counterPrice,
          quantity: offer.quantity_quintal,
          total: counterPrice * offer.quantity_quintal,
          message: counterMessage || 'Counter offer submitted.',
          time: 'Just now',
        }
      ])

      setCounterMessage('')
      toast.success('Counter Offer Sent', `Proposed ₹${counterPrice.toLocaleString('en-IN')}/q to ABC Foods`)
    } catch (err: any) {
      toast.error('Failed to submit counter offer', err?.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this deal?')) return

    setActionLoading(true)
    try {
      const updated = await rejectOffer(offer.id)
      setOffer(updated)
      toast.info('Offer Rejected', 'This negotiation has been closed.')
    } catch (err: any) {
      toast.error('Failed to reject offer', err?.message)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ paddingLeft: 0, marginBottom: '0.25rem' }}
            onClick={() => navigate('/crop-lots')}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, margin: 0 }}>
            Deal Negotiation & Contracts
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
            Offer #{offerId || offer.id} with ABC Foods Pvt Ltd
          </p>
        </div>

        {offer.status === 'accepted' && (
          <Button
            variant="primary"
            onClick={() => navigate('/transactions')}
            iconRight={<ArrowRight size={16} />}
          >
            Go to Transaction Tracker
          </Button>
        )}
      </div>

      {/* Primary Offer Summary Card */}
      <OfferCard
        offer={offer}
        counterpartyName="ABC Foods Pvt Ltd"
        perspective="farmer"
        onAccept={handleAccept}
        onReject={handleReject}
      />

      {/* Negotiation History Thread */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <MessageSquare size={20} color="var(--color-primary-400)" />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Negotiation Rounds</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((round, idx) => {
            const isMe = round.by === 'farmer'
            return (
              <div
                key={round.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: isMe ? 'rgba(34,197,94,0.1)' : 'var(--color-surface-700)',
                  border: isMe ? '1px solid rgba(34,197,94,0.25)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isMe ? '#4ade80' : 'var(--color-text-primary)' }}>
                    {isMe ? 'You (Farmer)' : 'ABC Foods (Buyer)'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    {round.time}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span className="price-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ade80' }}>
                    ₹{round.price.toLocaleString('en-IN')}/q
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    for {round.quantity} quintals (Total ₹{round.total.toLocaleString('en-IN')})
                  </span>
                </div>

                {round.message && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                    "{round.message}"
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Counter Offer Form (if still actionable) */}
      {offer.status !== 'accepted' && offer.status !== 'rejected' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Send a Counter Offer</h3>
          <form onSubmit={handleCounter} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Input
                label="Your Counter Price / Quintal (₹)"
                type="number"
                required
                min={100}
                step={10}
                iconLeft={<IndianRupee size={16} />}
                value={counterPrice}
                onChange={(e) => setCounterPrice(Number(e.target.value))}
              />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>New Total Value:</span>
                <span className="price-display" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4ade80' }}>
                  ₹{(counterPrice * offer.quantity_quintal).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message / Quality Guarantee (Optional)</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                placeholder="e.g. Grain moisture is guaranteed < 12%, warehouse ready for pickup tomorrow."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="primary"
                loading={actionLoading}
                icon={<ArrowLeftRight size={16} />}
              >
                Submit Counter Offer
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
