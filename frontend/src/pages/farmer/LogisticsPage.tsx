// ============================================================
// MORNINGSTAR — LOGISTICS PAGE
// Transport provider comparison, dispatch booking,
// and live shipment fulfillment tracking
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Truck, ArrowLeft, MapPin,
  CheckCircle2, Navigation, Check
} from 'lucide-react'
import { getLogisticsOptions } from '@/api/logistics'
import {
  Button, Badge, SkeletonCard, useToast
} from '@/components/ui'
import type { TransportOption } from '@/types'

export default function LogisticsPage() {
  const { transactionId } = useParams<{ transactionId: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [options, setOptions] = useState<TransportOption[]>([])
  const [selectedOptionId, setSelectedOptionId] = useState<string>('trans-001')
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  const loadLogistics = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getLogisticsOptions(transactionId || 'txn-001')
      setOptions(data)
    } catch (err: any) {
      toast.error('Failed to load logistics options', err?.message)
    } finally {
      setLoading(false)
    }
  }, [transactionId, toast])

  useEffect(() => {
    loadLogistics()
  }, [loadLogistics])

  const handleBookTransport = (providerName: string) => {
    setBooking(true)
    setTimeout(() => {
      setBooking(false)
      toast.success('Transport Booked!', `Driver assigned from ${providerName}. Pickup scheduled.`)
    }, 800)
  }

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ paddingLeft: 0, marginBottom: '0.25rem' }}
            onClick={() => navigate('/transactions')}
          >
            <ArrowLeft size={16} /> Back to Transactions
          </button>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, margin: 0 }}>
            Logistics & Transport
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
            Book trusted agricultural freight carriers for Transaction #{transactionId || 'txn-001'}
          </p>
        </div>
      </div>

      {/* Active Shipment Status */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(22,163,74,0.1) 0%, var(--color-surface-800) 70%)',
        border: '1px solid rgba(34,197,94,0.25)',
        padding: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #15803d, #22c55e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}>
              <Truck size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Shipment Status: Delivered</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Carrier: Shree Transport · Driver: Ramesh (+91-9876500001)
              </div>
            </div>
          </div>

          <Badge variant="success">
            <CheckCircle2 size={13} /> Completed
          </Badge>
        </div>

        {/* Route Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          background: 'var(--color-surface-700)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pickup Farm Location
            </div>
            <div style={{ fontWeight: 700, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={14} color="#4ade80" /> Nashik Farm Catchment
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Nashik, Maharashtra</div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Destination Factory
            </div>
            <div style={{ fontWeight: 700, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Navigation size={14} color="#60a5fa" /> ABC Foods Processing Unit
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>MIDC Ambad, Nashik (12 km)</div>
          </div>
        </div>
      </div>

      {/* Transport Providers List */}
      <div>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem' }}>Available Transport Carriers</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {options.map((opt) => {
            const isSelected = selectedOptionId === opt.id
            return (
              <div
                key={opt.id}
                className="card"
                style={{
                  border: isSelected ? '1px solid rgba(34,197,94,0.4)' : '1px solid var(--color-border)',
                  background: isSelected ? 'linear-gradient(135deg, rgba(22,163,74,0.06) 0%, var(--color-surface-800) 100%)' : 'var(--color-surface-800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  padding: '1.25rem',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedOptionId(opt.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'var(--color-surface-700)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4ade80',
                  }}>
                    <Truck size={22} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>{opt.provider}</h4>
                      <Badge variant="success">Verified Carrier</Badge>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      {opt.vehicle_type} · Capacity: {opt.capacity_quintal}q · Transit: ~{opt.estimated_hours} hours
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Estimated Cost</div>
                    <div className="price-display" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4ade80' }}>
                      ₹{opt.estimated_total.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      ₹{opt.price_per_km}/km
                    </div>
                  </div>

                  <Button
                    variant={isSelected ? 'primary' : 'secondary'}
                    size="sm"
                    loading={booking && isSelected}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBookTransport(opt.provider)
                    }}
                  >
                    {isSelected ? <><Check size={14} /> Booked</> : 'Select'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
