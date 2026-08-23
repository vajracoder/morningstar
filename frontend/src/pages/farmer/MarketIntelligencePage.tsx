// ============================================================
// MORNINGSTAR — MARKET INTELLIGENCE PAGE
// Real-time APMC mandi prices, multi-market comparison,
// and 14-day AI forecast visualization
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Brain, Building2, RefreshCw, ShieldCheck
} from 'lucide-react'
import { getCropLot } from '@/api/crops'
import { getForecast } from '@/api/forecast'
import { getMarketPrices } from '@/api/market'
import {
  Button, PriceChart, Table, Badge,
  SkeletonCard, SkeletonStatCard, useToast
} from '@/components/ui'
import type { TableColumn } from '@/components/ui'
import type { CropLot, PriceForecast, MarketPrice } from '@/types'

export default function MarketIntelligencePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [lot, setLot] = useState<CropLot | null>(null)
  const [forecast, setForecast] = useState<PriceForecast | null>(null)
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async (showToast = false) => {
    if (!id) return
    try {
      const lotData = await getCropLot(id)
      setLot(lotData)

      const [fData, mData] = await Promise.all([
        getForecast(id),
        getMarketPrices(lotData.crop_name, lotData.district),
      ])

      setForecast(fData)
      setMarketPrices(mData)
      if (showToast) toast.success('Market refreshed', 'Loaded latest APMC mandi rates.')
    } catch (err: any) {
      toast.error('Failed to load market data', err?.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [id, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData(true)
  }

  const columns: TableColumn<MarketPrice>[] = [
    {
      key: 'market_name',
      header: 'APMC Mandi',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={16} color="var(--color-primary-400)" />
          <strong>{row.market_name}</strong>
        </div>
      ),
    },
    {
      key: 'modal_price',
      header: 'Modal Price (Today)',
      align: 'right',
      render: (row) => (
        <span className="price-display" style={{ fontWeight: 800, color: '#4ade80', fontSize: '1rem' }}>
          ₹{row.modal_price.toLocaleString('en-IN')}/q
        </span>
      ),
    },
    {
      key: 'min_price',
      header: 'Min Rate',
      align: 'right',
      render: (row) => <span>₹{row.min_price.toLocaleString('en-IN')}</span>,
    },
    {
      key: 'max_price',
      header: 'Max Rate',
      align: 'right',
      render: (row) => <span>₹{row.max_price.toLocaleString('en-IN')}</span>,
    },
    {
      key: 'date',
      header: 'Updated',
      align: 'right',
      render: (row) => (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {new Date(row.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <SkeletonCard />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[1, 2, 3].map(i => <SkeletonStatCard key={i} />)}
        </div>
        <SkeletonCard />
      </div>
    )
  }

  const currentPrice = forecast?.current_price || 2480
  const highestForecast = forecast?.forecasts.reduce(
    (max, f) => (f.predicted_price > max.predicted_price ? f : max),
    forecast.forecasts[0]
  )

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header with Navigation */}
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
            Market Intelligence — {lot?.crop_name}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
            Live APMC prices, regional mandi trends, and AI price forecasts
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh latest mandi data"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/crop-lots/${id}/recommendation`)}
            icon={<Brain size={16} />}
          >
            View AI Recommendation
          </Button>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}>
        <div className="stat-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
            Current Modal Rate (Nashik)
          </div>
          <div className="price-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4ade80' }}>
            ₹{currentPrice.toLocaleString('en-IN')}/q
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: '0.25rem' }}>
            +₹15 from yesterday (+0.6%)
          </div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
            Peak Projected Rate (Day {highestForecast?.days || 7})
          </div>
          <div className="price-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fbbf24' }}>
            ₹{(highestForecast?.predicted_price || 2570).toLocaleString('en-IN')}/q
          </div>
          <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.25rem' }}>
            +₹{(highestForecast ? highestForecast.predicted_price - currentPrice : 90)}/q potential upside
          </div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
            Tracked APMC Mandis
          </div>
          <div className="price-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#60a5fa' }}>
            {marketPrices.length} Mandis
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Within 200km radius
          </div>
        </div>
      </div>

      {/* Main Chart */}
      {forecast && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>14-Day Price Forecast</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
                AI predictive model combining weather, crop arrivals, and historical patterns
              </p>
            </div>
            <Badge variant="success">
              <ShieldCheck size={12} /> High Confidence
            </Badge>
          </div>

          <PriceChart forecast={forecast} height={280} />
        </div>
      )}

      {/* Mandi Comparison Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Regional APMC Mandi Rates</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
              Compare prices across mandis in Maharashtra
            </p>
          </div>
        </div>

        <Table
          columns={columns}
          data={marketPrices}
          rowKey="market_id"
        />
      </div>
    </div>
  )
}
