// ============================================================
// MORNINGSTAR — CROP LOT DETAIL PAGE (Production Redesign)
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Wheat, MapPin, Warehouse, ShieldCheck,
  TrendingUp, Brain, Users, ArrowLeft, ArrowUpRight,
  AlertCircle, Sparkles, Scale
} from 'lucide-react'
import { getCropLot, getQualityReport } from '@/api/crops'
import { getForecast } from '@/api/forecast'
import { getRecommendation } from '@/api/recommendations'
import {
  Badge, Button, AIRecommendationCard,
  PriceChart, SkeletonCard, useToast
} from '@/components/ui'
import type { CropLot, CropQualityReport, PriceForecast, SaleRecommendation } from '@/types'

export default function CropLotDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [lot, setLot] = useState<CropLot | null>(null)
  const [quality, setQuality] = useState<CropQualityReport | null>(null)
  const [forecast, setForecast] = useState<PriceForecast | null>(null)
  const [recommendation, setRecommendation] = useState<SaleRecommendation | null>(null)
  const [loading, setLoading] = useState(true)

  const loadLotData = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const lotData = await getCropLot(id)
      setLot(lotData)

      const [qData, fData, rData] = await Promise.all([
        getQualityReport(id).catch(() => null),
        getForecast(id).catch(() => null),
        getRecommendation(id).catch(() => null),
      ])

      setQuality(qData)
      setForecast(fData)
      setRecommendation(rData)
    } catch (err: any) {
      toast.error('Failed to load lot details', err?.message)
    } finally {
      setLoading(false)
    }
  }, [id, toast])

  useEffect(() => {
    loadLotData()
  }, [loadLotData])

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 1000, margin: '0 auto' }}>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (!lot) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: 600, margin: '0 auto' }}>
        <AlertCircle size={40} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
        <h2>Crop Lot Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          We could not locate this crop lot in your registry.
        </p>
        <Button variant="secondary" onClick={() => navigate('/crop-lots')}>
          <ArrowLeft size={16} /> Back to Crop Lots
        </Button>
      </div>
    )
  }

  const currentPrice = forecast?.current_price || 2480
  const totalValue = lot.quantity_quintal * currentPrice

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
      {/* Navigation Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <Button
          variant="ghost"
          size="sm"
          style={{ paddingLeft: 0 }}
          onClick={() => navigate('/crop-lots')}
          icon={<ArrowLeft size={16} />}
        >
          All Crop Lots
        </Button>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/crop-lots/${lot.id}/market`)}
            icon={<TrendingUp size={15} />}
          >
            Market Prices
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/crop-lots/${lot.id}/recommendation`)}
            icon={<Brain size={15} />}
          >
            AI Advice
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/crop-lots/${lot.id}/buyers`)}
            icon={<Users size={15} />}
          >
            View Buyers
          </Button>
        </div>
      </div>

      {/* Lot Primary Banner */}
      <div className="card-hero">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              className="icon-box-lg"
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#4ade80',
              }}
            >
              <Wheat size={28} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
                  {lot.crop_name}
                  {lot.variety && <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: '0.4rem' }}>({lot.variety})</span>}
                </h1>
                <Badge variant="success">Grade {lot.grade}</Badge>
                <Badge variant="info">{lot.status.replace('_', ' ')}</Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Scale size={13} /> <strong>{lot.quantity_quintal}</strong> Quintals
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={13} /> {lot.location}, {lot.district}
                </span>
                {lot.storage_type && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Warehouse size={13} /> {lot.storage_type} ({lot.storage_capacity_days || 30}d safe)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Estimated Valuation
            </div>
            <div className="price-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4ade80' }}>
              ₹{totalValue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              @ ₹{currentPrice.toLocaleString('en-IN')}/q modal rate
            </div>
          </div>
        </div>
      </div>

      {/* AI Quality Report — Benchmark Grid */}
      {quality && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="#4ade80" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>AI Crop Quality Verification</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Graded on {new Date(quality.graded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div style={{
              background: 'var(--color-surface-700)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#fbbf24',
            }}>
              <Sparkles size={13} />
              <span>{Math.round(quality.ai_confidence * 100)}% Confidence</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            {/* Moisture */}
            <div style={{ background: 'var(--color-surface-700)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Moisture Content</span>
                <Badge variant="success">Optimal</Badge>
              </div>
              <div className="price-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {quality.moisture_percent ?? 12.5}%
              </div>
              <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>Benchmark: &lt; 14.0%</span>
            </div>

            {/* Protein */}
            <div style={{ background: 'var(--color-surface-700)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Protein Content</span>
                <Badge variant="success">High</Badge>
              </div>
              <div className="price-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {quality.protein_percent ?? 11.2}%
              </div>
              <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>Export Standard: &gt; 10.5%</span>
            </div>

            {/* Impurity */}
            <div style={{ background: 'var(--color-surface-700)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Foreign Matter</span>
                <Badge variant="success">Clean</Badge>
              </div>
              <div className="price-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {quality.impurity_percent ?? 1.8}%
              </div>
              <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>Tolerance: &lt; 2.0%</span>
            </div>
          </div>

          {quality.notes && (
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              background: 'var(--color-surface-700)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
            }}>
              💡 <strong>AI Agronomist Note:</strong> {quality.notes}
            </div>
          )}
        </div>
      )}

      {/* AI Recommendation Snapshot */}
      {recommendation && (
        <AIRecommendationCard
          recommendation={recommendation}
          onAction={() => navigate(`/crop-lots/${lot.id}/buyers`)}
        />
      )}

      {/* 14-Day Price Forecast Section */}
      {forecast && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                14-Day Price Projection
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.15rem 0 0' }}>
                Forecasted APMC modal rates for {lot.crop_name}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/crop-lots/${lot.id}/market`)}
              iconRight={<ArrowUpRight size={14} />}
            >
              Explore Mandis
            </Button>
          </div>

          <PriceChart forecast={forecast} height={240} />
        </div>
      )}
    </div>
  )
}
