// ============================================================
// MORNINGSTAR — AI RECOMMENDATION PAGE (Production Redesign)
// Clear financial modeling: Immediate Sale vs. Recommended Wait
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Warehouse, AlertTriangle,
  Coins, TrendingUp, ShieldCheck, Scale, CheckCircle2
} from 'lucide-react'
import { getCropLot } from '@/api/crops'
import { getRecommendation } from '@/api/recommendations'
import {
  Button, Badge, AIRecommendationCard,
  SkeletonCard, useToast
} from '@/components/ui'
import type { CropLot, SaleRecommendation } from '@/types'

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export default function RecommendationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [lot, setLot] = useState<CropLot | null>(null)
  const [rec, setRec] = useState<SaleRecommendation | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const [lotData, recData] = await Promise.all([
        getCropLot(id),
        getRecommendation(id),
      ])
      setLot(lotData)
      setRec(recData)
    } catch (err: any) {
      toast.error('Failed to load recommendation', err?.message)
    } finally {
      setLoading(false)
    }
  }, [id, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 960, margin: '0 auto' }}>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (!rec || !lot) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: 600, margin: '0 auto' }}>
        <AlertTriangle size={40} color="var(--color-warning)" style={{ margin: '0 auto 1rem' }} />
        <h2>Recommendation Unavailable</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          Could not compute market model for this crop lot.
        </p>
        <Button variant="secondary" onClick={() => navigate('/crop-lots')}>
          <ArrowLeft size={16} /> Back to Crop Lots
        </Button>
      </div>
    )
  }

  const isWait = rec.decision === 'WAIT'
  const grossUpside = rec.expected_gain + rec.storage_cost_total

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Button
            variant="ghost"
            size="sm"
            style={{ paddingLeft: 0, marginBottom: '0.25rem' }}
            onClick={() => navigate(`/crop-lots/${id}`)}
            icon={<ArrowLeft size={16} />}
          >
            Back to Lot Details
          </Button>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
            AI Sell / Wait Decision Modeling
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0' }}>
            Predictive financial analysis for {lot.quantity_quintal}q {lot.crop_name} ({lot.variety || 'Lok-1'})
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate(`/crop-lots/${id}/buyers`)}
          iconRight={<ArrowRight size={16} />}
        >
          View Matched Buyers
        </Button>
      </div>

      {/* Main Full-Width Recommendation Card */}
      <AIRecommendationCard
        recommendation={rec}
        onAction={() => navigate(`/crop-lots/${id}/buyers`)}
      />

      {/* Side-by-Side Financial Comparison */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Coins size={20} color="#4ade80" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Net Realisation Financial Comparison</h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}>
          {/* Option A: Sell Today */}
          <div style={{
            background: 'var(--color-surface-700)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                  Option A: Sell Today
                </span>
                <Badge variant="neutral">Immediate</Badge>
              </div>

              <div className="price-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>
                {formatINR(rec.net_realisation_current)}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                • Zero storage holding cost<br />
                • Immediate cash settlement<br />
                • Misses projected +₹90/q price upside
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/crop-lots/${id}/buyers`)}
            >
              Liquidate Today
            </Button>
          </div>

          {/* Option B: Recommended Wait */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(22,163,74,0.12) 0%, var(--color-surface-700) 100%)',
            border: '1px solid rgba(34,197,94,0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute',
              top: -10,
              right: 14,
              background: 'var(--color-primary-600)',
              color: '#fff',
              fontSize: '0.6875rem',
              fontWeight: 800,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-pill)',
              letterSpacing: '0.05em',
            }}>
              ⭐ AI OPTIMAL
            </span>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4ade80' }}>
                  Option B: Wait {rec.recommended_days} Days
                </span>
                <Badge variant="success">Recommended</Badge>
              </div>

              <div className="price-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4ade80' }}>
                {formatINR(rec.net_realisation_recommended)}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                • Gross price upside: <strong>+{formatINR(grossUpside)}</strong><br />
                • Warehouse fee (7 days): <strong>-{formatINR(rec.storage_cost_total)}</strong><br />
                • <strong style={{ color: '#4ade80' }}>Net Profit Benefit: +{formatINR(rec.expected_gain)}</strong>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/crop-lots/${id}/buyers`)}
            >
              Lock in Forward Buyers
            </Button>
          </div>
        </div>

        {/* Visual Math Formula Breakdown */}
        <div style={{
          background: 'var(--color-surface-900)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
            Decision Calculation Formula
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            textAlign: 'center',
          }}>
            <div style={{ background: 'var(--color-surface-700)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Projected Gross Upside</div>
              <div className="price-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4ade80', marginTop: '0.2rem' }}>
                +{formatINR(grossUpside)}
              </div>
            </div>

            <div style={{ background: 'var(--color-surface-700)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Storage Holding Fee</div>
              <div className="price-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f87171', marginTop: '0.2rem' }}>
                -{formatINR(rec.storage_cost_total)}
              </div>
            </div>

            <div style={{ background: 'rgba(34,197,94,0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div style={{ fontSize: '0.7rem', color: '#4ade80' }}>Net Realisation Gain</div>
              <div className="price-display" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#4ade80', marginTop: '0.2rem' }}>
                +{formatINR(rec.expected_gain)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
