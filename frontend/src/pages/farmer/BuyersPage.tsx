// ============================================================
// MORNINGSTAR — BUYERS MATCHING PAGE
// Verified buyer matchmaking, risk profiling, trust ratings,
// and direct offer initiation drawer
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Users, ArrowLeft, IndianRupee, Send
} from 'lucide-react'
import { getCropLot } from '@/api/crops'
import { getBuyerMatches } from '@/api/buyers'
import { createOffer } from '@/api/offers'
import {
  Button, BuyerCard, Drawer, Input,
  SkeletonCard, EmptyState, useToast
} from '@/components/ui'
import type { CropLot, BuyerMatch } from '@/types'

export default function BuyersPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [lot, setLot] = useState<CropLot | null>(null)
  const [buyers, setBuyers] = useState<BuyerMatch[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [selectedType, setSelectedType] = useState<string>('all')
  const [lowRiskOnly, setLowRiskOnly] = useState(false)

  // Offer Drawer State
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerMatch | null>(null)
  const [offerPrice, setOfferPrice] = useState<number>(2600)
  const [offerQty, setOfferQty] = useState<number>(100)
  const [offerNote, setOfferNote] = useState<string>('Grade A Lok-1 wheat available for immediate dispatch.')
  const [sendingOffer, setSendingOffer] = useState(false)

  const loadData = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const [lotData, buyersData] = await Promise.all([
        getCropLot(id),
        getBuyerMatches(id),
      ])
      setLot(lotData)
      setBuyers(buyersData)
      if (lotData) {
        setOfferQty(lotData.quantity_quintal)
      }
    } catch (err: any) {
      toast.error('Failed to load buyers', err?.message)
    } finally {
      setLoading(false)
    }
  }, [id, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleOpenOfferDrawer = (match: BuyerMatch) => {
    setSelectedBuyer(match)
    if (match.offered_price) {
      setOfferPrice(match.offered_price)
    } else {
      setOfferPrice(2600)
    }
  }

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBuyer || !lot) return

    setSendingOffer(true)
    try {
      const offer = await createOffer({
        crop_lot_id: lot.id,
        buyer_id: selectedBuyer.buyer.id,
        farmer_id: lot.farmer_id,
        price_per_quintal: Number(offerPrice),
        quantity_quintal: Number(offerQty),
        total_amount: Number(offerPrice) * Number(offerQty),
        initiated_by: 'farmer',
        notes: offerNote,
      })

      toast.success('Offer Sent!', `Proposal sent to ${selectedBuyer.buyer.name}`)
      setSelectedBuyer(null)
      navigate(`/negotiations/${offer.id}`)
    } catch (err: any) {
      toast.error('Failed to send offer', err?.message)
    } finally {
      setSendingOffer(false)
    }
  }

  const filteredBuyers = buyers.filter((b) => {
    if (selectedType !== 'all' && b.buyer.type !== selectedType) return false
    if (lowRiskOnly && b.risk_level !== 'LOW') return false
    return true
  })

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <SkeletonCard />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ paddingLeft: 0, marginBottom: '0.25rem' }}
            onClick={() => navigate(`/crop-lots/${id}`)}
          >
            <ArrowLeft size={16} /> Back to Lot Details
          </button>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, margin: 0 }}>
            Matched Buyers — {lot?.crop_name}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
            Verified institutional buyers & processors ranked by match rating and payment reliability
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        background: 'var(--color-surface-800)',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Buyers' },
            { id: 'processor', label: 'Food Processors' },
            { id: 'exporter', label: 'Exporters' },
            { id: 'retailer', label: 'Retail Chains' },
          ].map(t => (
            <button
              key={t.id}
              className={`btn btn-sm ${selectedType === t.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem' }}
              onClick={() => setSelectedType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          <input
            type="checkbox"
            checked={lowRiskOnly}
            onChange={(e) => setLowRiskOnly(e.target.checked)}
            style={{ accentColor: 'var(--color-primary-500)' }}
          />
          Low Risk Only
        </label>
      </div>

      {/* Buyer Cards Grid */}
      {filteredBuyers.length === 0 ? (
        <EmptyState
          icon={<Users size={36} />}
          title="No Buyers Matching Filters"
          description="Try relaxing your filters to view more institutional buyers in your state."
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}>
          {filteredBuyers.map((match, idx) => (
            <BuyerCard
              key={match.buyer.id}
              match={match}
              rank={idx + 1}
              onContact={() => handleOpenOfferDrawer(match)}
              onViewProfile={() => handleOpenOfferDrawer(match)}
            />
          ))}
        </div>
      )}

      {/* Offer Negotiation Drawer */}
      <Drawer
        open={!!selectedBuyer}
        onClose={() => setSelectedBuyer(null)}
        title={selectedBuyer ? `Initiate Deal with ${selectedBuyer.buyer.name}` : ''}
      >
        {selectedBuyer && (
          <form onSubmit={handleSendOffer} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Buyer Trust Strip */}
            <div style={{
              background: 'var(--color-surface-700)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontWeight: 700 }}>{selectedBuyer.buyer.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {selectedBuyer.buyer.location}, {selectedBuyer.buyer.state} · Pays in avg {selectedBuyer.buyer.avg_payment_days} days
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ade80' }}>
                ⭐ {selectedBuyer.match_score}% Match
              </span>
            </div>

            <Input
              label="Offered Price / Quintal (₹)"
              type="number"
              required
              min={100}
              step={10}
              iconLeft={<IndianRupee size={16} />}
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
              helper={`Market modal today: ₹2,480/q`}
            />

            <Input
              label="Quantity to Sell (Quintals)"
              type="number"
              required
              min={1}
              max={lot?.quantity_quintal || 100}
              value={offerQty}
              onChange={(e) => setOfferQty(Number(e.target.value))}
              helper={`Max available in this lot: ${lot?.quantity_quintal || 100}q`}
            />

            {/* Total Deal Estimation */}
            <div style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Total Proposed Deal Value:
              </span>
              <span className="price-display" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4ade80' }}>
                ₹{(offerPrice * offerQty).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Note / Terms for Buyer</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={offerNote}
                onChange={(e) => setOfferNote(e.target.value)}
                placeholder="Add special terms, dispatch readiness, or quality notes..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSelectedBuyer(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={sendingOffer}
                icon={<Send size={16} />}
                style={{ flex: 2 }}
              >
                Send Offer Proposal
              </Button>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  )
}
