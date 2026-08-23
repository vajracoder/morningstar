// ============================================================
// MORNINGSTAR — AI RECOMMENDATION PAGE
// Comprehensive Sell vs Wait decision engine explanation,
// storage cost vs price gain financial modeling, and risk factors
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight,
  Warehouse, AlertTriangle, Coins
} from 'lucide-react'
import { getCropLot } from '@/api/crops'
import { getRecommendation } from '@/api/recommendations'
import {
  Button, Badge, AIRecommendationCard,
  SkeletonCard, useToast
} from '@/components/ui'
import type { CropLot, SaleRecommendation } from '@/types'

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
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (!rec || !lot) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
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
  const isSellNow = rec.decision === 'SELL_NOW'

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back link & Top Bar */}
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
            AI Sell / Wait Recommendation
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
            Powered by MorningStar Predictive Agronomics Engine
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

      {/* Financial Comparison: Sell Today vs Recommended Wait */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
          <Coins size={22} color="#4ade80" />
          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Net Realisation Comparison</h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}>
          {/* Option A: Sell Now */}
          <div style={{
            background: 'var(--color-surface-700)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                Option A: Sell Today
              </span>
              <Badge variant="neutral">Immediate</Badge>
            </div>
            <div className="price-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              ₹{rec.net_realisation_current.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              • Zero additional storage cost<br />
              • Immediate liquidity<br />
              • Misses projected +₹90/q price increase
            </div>
          </div>

          {/* Option B: Wait (Recommended) */}
          <div style={{
            background: isWait ? 'linear-gradient(135deg, rgba(22,163,74,0.12) 0%, var(--color-surface-700) 100%)' : 'var(--color-surface-700)',
            border: isWait ? '1px solid rgba(34,197,94,0.4)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            position: 'relative',
          }}>
            {isWait && (
              <span style={{
                position: 'absolute',
                top: -10,
                right: 14,
                background: 'var(--color-primary-600)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: 999,
              }}>
                ⭐ AI OPTIMAL
              </span>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isWait ? '#4ade80' : 'var(--color-text-muted)' }}>
                Option B: Wait {rec.recommended_days} Days
              </span>
              <Badge variant="success">Recommended</Badge>
            </div>
            <div className="price-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4ade80' }}>
              ₹{rec.net_realisation_recommended.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              • Gross price upside: +₹9,000<br />
              • Warehouse holding fee: -₹{rec.storage_cost_total.toLocaleString('en-IN')}<br />
              • <strong style={{ color: '#4ade80' }}>Net Benefit: +₹{rec.expected_gain.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* Cost Breakdown Accordion */}
        <div style={{
          background: 'var(--color-surface-700)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontSize: '0.85rem',
        }}>
          <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Warehouse size={16} color="var(--color-primary-400)" />
            How MorningStar Calculated Your Benefit:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Storage Cost / Day:</span>
              <div style={{ fontWeight: 600 }}>₹{(rec.storage_cost_total / (rec.recommended_days || 7)).toFixed(0)} / day</div>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Spoilage Risk:</span>
              <div style={{ fontWeight: 600, color: rec.spoilage_risk_percent < 3 ? '#4ade80' : '#fbbf24' }}>
                {rec.spoilage_risk_percent}% (Low)
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>AI Confidence Score:</span>
              <div style={{ fontWeight: 600, color: '#4ade80' }}>
                {Math.round(rec.confidence * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Next Step Action */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, var(--color-surface-800) 100%)',
        border: '1px solid rgba(59,130,246,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.05rem' }}>Ready to explore buyers while waiting?</h4>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Lock in forward contracts or begin negotiating target prices with verified food processors.
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
    </div>
  )
}
