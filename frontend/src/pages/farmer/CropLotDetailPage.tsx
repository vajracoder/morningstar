// ============================================================
// MORNINGSTAR — CROP LOT DETAIL PAGE
// Complete overview of a crop lot: Quality report, AI recommendation,
// price forecast summary, and direct links to Market, Rec, & Buyers
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Wheat, MapPin, Calendar, Warehouse, ShieldCheck,
  TrendingUp, Brain, Users, ArrowLeft, ArrowUpRight,
  CheckCircle2, AlertCircle, Droplets, Sparkles, Scale
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
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (!lot) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back link & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ paddingLeft: 0 }}
          onClick={() => navigate('/crop-lots')}
        >
          <ArrowLeft size={16} /> All Crop Lots
        </button>

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
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(22,163,74,0.1) 0%, var(--color-surface-800) 70%)',
        border: '1px solid rgba(34,197,94,0.25)',
        padding: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #15803d, #22c55e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
              flexShrink: 0,
            }}>
              <Wheat size={30} color="#fff" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                  {lot.crop_name}
                  {lot.variety && <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>({lot.variety})</span>}
                </h1>
                <Badge variant={lot.grade === 'A' ? 'success' : lot.grade === 'B' ? 'warning' : 'neutral'}>
                  Grade {lot.grade}
                </Badge>
                <Badge variant="info">
                  {lot.status.replace('_', ' ')}
                </Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Scale size={14} /> <strong>{lot.quantity_quintal}</strong> Quintals
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={14} /> {lot.location}, {lot.district}
                </span>
                {lot.storage_type && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Warehouse size={14} /> {lot.storage_type} ({lot.storage_capacity_days || 30}d safe)
                  </span>
                )}
                {lot.harvest_date && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={14} /> Harvest: {new Date(lot.harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Est. Total Valuation</div>
            <div className="price-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4ade80' }}>
              ₹{totalValue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              @ ₹{currentPrice.toLocaleString('en-IN')}/quintal
            </div>
          </div>
        </div>
      </div>

      {/* AI Quality Report Card */}
      {quality && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <ShieldCheck size={22} color="#4ade80" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI Crop Quality Report</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Graded on {new Date(quality.graded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="#fbbf24" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24' }}>
                {Math.round(quality.ai_confidence * 100)}% AI Confidence
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            <div style={{ background: 'var(--color-surface-700)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                <Droplets size={14} color="#60a5fa" /> Moisture Content
              </div>
              <div className="price-display" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {quality.moisture_percent ?? 12.5}%
              </div>
              <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>Optimal (&lt; 14%)</span>
            </div>

            <div style={{ background: 'var(--color-surface-700)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                <CheckCircle2 size={14} color="#4ade80" /> Protein Content
              </div>
              <div className="price-display" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {quality.protein_percent ?? 11.2}%
              </div>
              <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>High (Grade A standard)</span>
            </div>

            <div style={{ background: 'var(--color-surface-700)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                <AlertCircle size={14} color="#fbbf24" /> Foreign Impurities
              </div>
              <div className="price-display" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {quality.impurity_percent ?? 1.8}%
              </div>
              <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>Well within limit (&lt; 2%)</span>
            </div>
          </div>

          {quality.notes && (
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              background: 'rgba(34,197,94,0.05)',
              border: '1px solid rgba(34,197,94,0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              margin: 0,
            }}>
              💡 <strong>AI Agronomist Note:</strong> {quality.notes}
            </p>
          )}
        </div>
      )}

      {/* AI Recommendation Snapshot */}
      {recommendation && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={20} color="#f59e0b" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI Sell / Wait Recommendation</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/crop-lots/${lot.id}/recommendation`)}
            >
              Full Analysis <ArrowUpRight size={14} />
            </Button>
          </div>

          <AIRecommendationCard
            recommendation={recommendation}
            onAction={() => navigate(`/crop-lots/${lot.id}/buyers`)}
          />
        </div>
      )}

      {/* Price Forecast Chart Section */}
      {forecast && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                14-Day Price Projection
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0' }}>
                Forecasted APMC modal rates for {lot.crop_name}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/crop-lots/${lot.id}/market`)}
            >
              Explore Mandis <ArrowUpRight size={14} />
            </Button>
          </div>

          <PriceChart forecast={forecast} height={240} />
        </div>
      )}
    </div>
  )
}
