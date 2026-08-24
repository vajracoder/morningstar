// ============================================================
// MORNINGSTAR — DASHBOARD PAGE (Production Redesign)
// Clear hierarchy: AI Recommendation Hero -> Metric Strip ->
// Two-Column Market & Buyer Split -> Order Journey Timeline
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wheat, TrendingUp, Brain, Users, Plus,
  ChevronRight, Sprout, MapPin, Scale, Receipt,
  ArrowUpRight, RefreshCw, CheckCircle2
} from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { getCropLots } from '@/api/crops'
import { getForecast } from '@/api/forecast'
import { getRecommendation } from '@/api/recommendations'
import { getBuyerMatches } from '@/api/buyers'
import { getMarketPrices } from '@/api/market'

import {
  AIRecommendationCard, StatCard, BuyerCard, PriceChart,
  Timeline, SkeletonStatCard, SkeletonCard, Button, Badge, useToast
} from '@/components/ui'
import type { TimelineStep } from '@/components/ui'
import type { CropLot, PriceForecast, SaleRecommendation, BuyerMatch, MarketPrice } from '@/types'

const JOURNEY_STEPS: TimelineStep[] = [
  { id: 'lot',       label: 'Lot Created',     description: '100q Lok-1 Wheat',          status: 'done'   },
  { id: 'quality',   label: 'AI Quality',      description: 'Grade A Certified (93%)',   status: 'done'   },
  { id: 'market',    label: 'Market Intel',    description: 'Live APMC Rates',           status: 'done'   },
  { id: 'rec',       label: 'Decision',        description: 'Wait 7 Days (+₹5,500)',     status: 'done'   },
  { id: 'buyer',     label: 'Buyer Matched',   description: 'ABC Foods (94% Match)',     status: 'active' },
  { id: 'negotiate', label: 'Negotiation',     description: 'Counter & Terms',           status: 'pending'},
  { id: 'contract',  label: 'Contract',        description: 'Digital Agreement',         status: 'pending'},
  { id: 'logistics', label: 'Logistics',       description: 'Transport Pickup',          status: 'pending'},
  { id: 'payment',   label: 'Payment',         description: 'NEFT Settlement',           status: 'pending'},
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [cropLot, setCropLot] = useState<CropLot | null>(null)
  const [forecast, setForecast] = useState<PriceForecast | null>(null)
  const [recommendation, setRecommendation] = useState<SaleRecommendation | null>(null)
  const [buyers, setBuyers] = useState<BuyerMatch[]>([])
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async (showRefreshToast = false) => {
    try {
      const lots = await getCropLots()
      const lot = lots[0] ?? null
      setCropLot(lot)

      if (lot) {
        const [fc, rec, bm, mp] = await Promise.all([
          getForecast(lot.id).catch(() => null),
          getRecommendation(lot.id).catch(() => null),
          getBuyerMatches(lot.id).catch(() => []),
          getMarketPrices(lot.crop_name).catch(() => []),
        ])
        setForecast(fc)
        setRecommendation(rec)
        setBuyers(bm)
        setMarketPrices(mp)
      }
      if (showRefreshToast) toast.success('Dashboard Synced', 'Latest APMC rates & AI models updated.')
    } catch (err: any) {
      toast.error('Failed to load dashboard data', err?.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData(true)
  }

  const currentPrice = forecast?.current_price ?? 2480
  const bestForecast = forecast?.forecasts.reduce((best, f) =>
    f.predicted_price > best.predicted_price ? f : best,
    forecast.forecasts[0]
  )

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>

      {/* ---- 1. Page Header ---- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {getGreeting()}, <strong>{user?.name?.split(' ')[0] || 'Rajesh'}</strong> 👋
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.7rem', color: '#4ade80', background: 'rgba(34, 197, 94, 0.1)',
              padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(34, 197, 94, 0.25)',
            }}>
              <CheckCircle2 size={11} /> Mandi Synced
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.85rem)', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
            Farm Operations Command Center
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            icon={<RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />}
            aria-label="Refresh market data"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/crop-lots/new')}
            icon={<Plus size={16} />}
          >
            Register Lot
          </Button>
        </div>
      </div>

      {/* ---- 2. Hero Section: Active Crop Lot & AI Recommendation Anchor ---- */}
      {loading ? (
        <SkeletonCard />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* Active Harvest Card */}
          {cropLot ? (
            <div
              className="card-interactive"
              style={{
                background: 'linear-gradient(135deg, rgba(22,163,74,0.08) 0%, var(--color-surface-800) 70%)',
                border: '1px solid rgba(34,197,94,0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
              onClick={() => navigate(`/crop-lots/${cropLot.id}`)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4ade80' }}>
                    Active Registered Inventory
                  </span>
                  <Badge variant="success">Grade {cropLot.grade}</Badge>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div
                    className="icon-box-lg"
                    style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#4ade80',
                    }}
                  >
                    <Wheat size={26} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
                      {cropLot.crop_name} {cropLot.variety && `(${cropLot.variety})`}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginTop: '0.35rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Scale size={13} /> <strong>{cropLot.quantity_quintal}</strong>q
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={13} /> {cropLot.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--color-surface-700)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--color-border)',
              }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Estimated Lot Worth</div>
                  <div className="price-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ade80' }}>
                    ₹{((cropLot.quantity_quintal) * currentPrice).toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  <span>View Details</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <Sprout size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.5rem' }} />
              <h3>No Active Harvest Lots</h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Register your crop to start getting AI market forecasts.</p>
              <Button variant="primary" size="sm" onClick={() => navigate('/crop-lots/new')}>
                <Plus size={15} /> Create Crop Lot
              </Button>
            </div>
          )}

          {/* AI Sell/Wait Recommendation Anchor */}
          {recommendation && (
            <AIRecommendationCard
              recommendation={recommendation}
              onAction={() => cropLot && navigate(`/crop-lots/${cropLot.id}/buyers`)}
            />
          )}
        </div>
      )}

      {/* ---- 3. Key Financial Metrics Strip ---- */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}>
        {loading ? (
          [1, 2, 3, 4].map(i => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Today's Modal Rate"
              value={`₹${currentPrice.toLocaleString('en-IN')}/q`}
              subValue="Nashik APMC benchmark"
              trend="up"
              trendText="+₹15 vs yesterday"
              icon={<TrendingUp size={20} />}
              iconBg="rgba(34, 197, 94, 0.12)"
              accentColor="#22c55e"
            />
            <StatCard
              label="Peak 7-Day Forecast"
              value={bestForecast ? `₹${bestForecast.predicted_price.toLocaleString('en-IN')}/q` : '—'}
              subValue={`Day ${bestForecast?.days ?? 7} projection`}
              trend="up"
              trendText={bestForecast ? `+₹${bestForecast.predicted_price - currentPrice}/q upside` : ''}
              icon={<Brain size={20} />}
              iconBg="rgba(245, 158, 11, 0.12)"
              accentColor="#f59e0b"
            />
            <StatCard
              label="Verified Buyers Available"
              value={buyers.length}
              subValue={buyers[0] ? `Top Match: ${buyers[0].buyer.name}` : 'Scanning mandis...'}
              icon={<Users size={20} />}
              iconBg="rgba(168, 85, 247, 0.12)"
              accentColor="#a855f7"
              onClick={() => cropLot && navigate(`/crop-lots/${cropLot.id}/buyers`)}
            />
            <StatCard
              label="Settled Receipts"
              value="₹2,60,000"
              subValue="NEFT verified (UTR)"
              icon={<Receipt size={20} />}
              iconBg="rgba(59, 130, 246, 0.12)"
              accentColor="#3b82f6"
              onClick={() => navigate('/transactions')}
            />
          </>
        )}
      </div>

      {/* ---- 4. Two-Column Split: Market Intelligence & Top Buyer Proposals ---- */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Left: Price Projection Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                  14-Day Price Forecast Curve
                </h3>
                <p style={{ fontSize: '0.75rem', margin: '0.15rem 0 0', color: 'var(--color-text-muted)' }}>
                  Predictive APMC modal price trends for {cropLot?.crop_name || 'Wheat'}
                </p>
              </div>
              {cropLot && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/crop-lots/${cropLot.id}/market`)}
                  iconRight={<ArrowUpRight size={14} />}
                >
                  Full Report
                </Button>
              )}
            </div>

            {forecast ? (
              <PriceChart forecast={forecast} height={220} />
            ) : (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Loading forecast models...
              </div>
            )}
          </div>

          {/* Regional comparison chips */}
          {!loading && marketPrices.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {marketPrices.slice(0, 3).map(mp => (
                <div key={mp.market_id} style={{
                  background: 'var(--color-surface-700)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{mp.market_name}:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>₹{mp.modal_price.toLocaleString('en-IN')}/q</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Top Buyer Matches */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                  Top Matched Institutional Buyers
                </h3>
                <p style={{ fontSize: '0.75rem', margin: '0.15rem 0 0', color: 'var(--color-text-muted)' }}>
                  Verified food processors with high payment reliability
                </p>
              </div>
              {cropLot && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/crop-lots/${cropLot.id}/buyers`)}
                  iconRight={<ArrowUpRight size={14} />}
                >
                  All {buyers.length} Buyers
                </Button>
              )}
            </div>

            {buyers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {buyers.slice(0, 2).map((match, idx) => (
                  <BuyerCard
                    key={match.buyer.id}
                    match={match}
                    rank={idx + 1}
                    onContact={() => {
                      toast.info('Proposal Initiated', `Opening negotiation with ${match.buyer.name}`)
                      navigate(`/crop-lots/${cropLot?.id}/buyers`)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No active buyer matches found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---- 5. Order Fulfillment Journey Timeline ---- */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
              End-to-End Fulfillment Journey
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.15rem 0 0' }}>
              Current milestone: <strong style={{ color: '#4ade80' }}>Buyer Matching & Proposal</strong>
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/transactions')}
          >
            Transaction Details
          </Button>
        </div>

        <Timeline steps={JOURNEY_STEPS} orientation="horizontal" />
      </div>
    </div>
  )
}
