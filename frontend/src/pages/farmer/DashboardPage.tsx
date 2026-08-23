// ============================================================
// MORNINGSTAR — DASHBOARD PAGE
// The farmer's command center. Must immediately answer:
// WHAT I HAVE → WHAT IT'S WORTH → WHAT WILL HAPPEN →
// WHAT SHOULD I DO → WHO TO SELL TO → WHAT HAPPENS NEXT
// ============================================================

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wheat, TrendingUp, Brain, Users, Bell, Plus,
  ChevronRight, Sprout, MapPin, Calendar, Package,
  ArrowUpRight, RefreshCw,
} from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { getCropLots } from '@/api/crops'
import { getForecast } from '@/api/forecast'
import { getRecommendation } from '@/api/recommendations'
import { getBuyerMatches } from '@/api/buyers'
import { getMarketPrices } from '@/api/market'

import {
  AIRecommendationCard, StatCard, BuyerCard, PriceChart,
  Timeline, SkeletonStatCard, SkeletonCard, useToast,
} from '@/components/ui'
import type { TimelineStep } from '@/components/ui'

import type { CropLot, PriceForecast, SaleRecommendation, BuyerMatch, MarketPrice } from '@/types'

// Journey steps for the farmer
const JOURNEY_STEPS = (status: string): TimelineStep[] => {
  const steps: { id: string; label: string; description: string; done: boolean; active: boolean }[] = [
    { id: 'lot',      label: 'Crop Lot Created',  description: 'Your lot is registered',        done: true,   active: false },
    { id: 'quality',  label: 'Quality Graded',    description: 'AI graded your crop',           done: true,   active: false },
    { id: 'market',   label: 'Market Intelligence', description: 'Live prices fetched',         done: true,   active: false },
    { id: 'rec',      label: 'AI Recommendation', description: 'Sell/Wait decision ready',      done: true,   active: false },
    { id: 'buyer',    label: 'Buyer Matched',      description: 'Top buyers identified',         done: false,  active: true  },
    { id: 'negotiate',label: 'Negotiate',          description: 'Get the best deal',             done: false,  active: false },
    { id: 'contract', label: 'Contract Signed',    description: 'Legal agreement',               done: false,  active: false },
    { id: 'logistics',label: 'Pickup & Delivery',  description: 'Transport arranged',            done: false,  active: false },
    { id: 'payment',  label: 'Payment Received',   description: 'Money in your account',         done: false,  active: false },
  ]
  return steps.map(s => ({
    id: s.id,
    label: s.label,
    description: s.description,
    status: s.done ? 'done' : s.active ? 'active' : 'pending',
  }))
}

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

  const loadData = async (showRefreshToast = false) => {
    try {
      const lots = await getCropLots()
      const lot = lots[0] ?? null
      setCropLot(lot)

      if (lot) {
        const [fc, rec, bm, mp] = await Promise.all([
          getForecast(lot.id),
          getRecommendation(lot.id),
          getBuyerMatches(lot.id),
          getMarketPrices(lot.crop_name),
        ])
        setForecast(fc)
        setRecommendation(rec)
        setBuyers(bm)
        setMarketPrices(mp)
      }
      if (showRefreshToast) toast.success('Dashboard updated', 'Latest market data loaded.')
    } catch (err: any) {
      toast.error('Failed to load data', err?.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData(true)
  }

  const currentPrice = forecast?.current_price ?? 0
  const bestForecast = forecast?.forecasts.reduce((best, f) =>
    f.predicted_price > best.predicted_price ? f : best,
    forecast.forecasts[0]
  )

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ---- Page Header ---- */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Rajesh'} 👋
          </p>
          <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, margin: 0 }}>
            Your Farm Dashboard
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh data"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/crop-lots/new')}
          >
            <Plus size={16} />
            New Lot
          </button>
        </div>
      </div>

      {/* ---- SECTION 1: WHAT I HAVE — Crop Lot Summary ---- */}
      {loading ? (
        <SkeletonCard />
      ) : cropLot ? (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(22,163,74,0.08) 0%, var(--color-surface-800) 60%)',
            border: '1px solid rgba(34,197,94,0.15)',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/crop-lots/${cropLot.id}`)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(22,163,74,0.2), rgba(34,197,94,0.1))',
                border: '1px solid rgba(34,197,94,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Wheat size={26} color="#4ade80" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    {cropLot.crop_name}
                    {cropLot.variety && <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: '0.375rem' }}>({cropLot.variety})</span>}
                  </h2>
                  <span style={{
                    background: 'rgba(34,197,94,0.15)', color: '#4ade80',
                    border: '1px solid rgba(34,197,94,0.25)',
                    fontSize: '0.75rem', fontWeight: 700,
                    padding: '0.2rem 0.6rem', borderRadius: 999,
                  }}>
                    Grade {cropLot.grade}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.375rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    <Package size={13} /> {cropLot.quantity_quintal} quintal
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    <MapPin size={13} /> {cropLot.location}
                  </span>
                  {cropLot.harvest_date && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      <Calendar size={13} /> Harvested {new Date(cropLot.harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem',
                borderRadius: 999,
                background: cropLot.status === 'quality_done' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                color: cropLot.status === 'quality_done' ? '#4ade80' : '#fbbf24',
                border: `1px solid ${cropLot.status === 'quality_done' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
                textTransform: 'capitalize',
              }}>
                {cropLot.status.replace('_', ' ')}
              </span>
              <ChevronRight size={18} color="var(--color-text-muted)" />
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <Sprout size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Crop Lots Yet</h3>
          <p style={{ marginBottom: '1.25rem', fontSize: '0.875rem' }}>Add your first crop lot to get started</p>
          <button className="btn btn-primary" onClick={() => navigate('/crop-lots/new')}>
            <Plus size={16} /> Create Crop Lot
          </button>
        </div>
      )}

      {/* ---- SECTION 2: WHAT IT'S WORTH — Stats Row ---- */}
      <div className="stagger-children" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.875rem',
      }}>
        {loading ? (
          [1, 2, 3, 4].map(i => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Market Price"
              value={`₹${currentPrice.toLocaleString('en-IN')}/q`}
              subValue="Nashik APMC today"
              trend="up"
              trendText="+₹15 from yesterday"
              icon={<TrendingUp size={22} />}
              iconBg="rgba(34,197,94,0.1)"
              accentColor="#22c55e"
            />
            <StatCard
              label="7-Day Forecast"
              value={bestForecast ? `₹${bestForecast.predicted_price.toLocaleString('en-IN')}/q` : '—'}
              subValue={`Day ${bestForecast?.days ?? 7} peak`}
              trend="up"
              trendText={bestForecast ? `+₹${bestForecast.predicted_price - currentPrice}/q` : ''}
              icon={<Brain size={22} />}
              iconBg="rgba(245,158,11,0.1)"
              accentColor="#f59e0b"
            />
            <StatCard
              label="Total Value"
              value={`₹${((cropLot?.quantity_quintal ?? 100) * currentPrice).toLocaleString('en-IN')}`}
              subValue={`${cropLot?.quantity_quintal ?? 100}q × ₹${currentPrice}/q`}
              icon={<Package size={22} />}
              iconBg="rgba(59,130,246,0.1)"
              accentColor="#3b82f6"
            />
            <StatCard
              label="Buyers Available"
              value={buyers.length}
              subValue={buyers[0] ? `Top: ${buyers[0].buyer.name}` : 'Loading...'}
              icon={<Users size={22} />}
              iconBg="rgba(168,85,247,0.1)"
              accentColor="#a855f7"
              onClick={() => cropLot && navigate(`/crop-lots/${cropLot.id}/buyers`)}
            />
          </>
        )}
      </div>

      {/* ---- SECTION 3: WHAT MAY HAPPEN — Price Chart ---- */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
              Price Forecast — {cropLot?.crop_name || 'Wheat'}
            </h3>
            <p style={{ fontSize: '0.8rem', margin: '0.25rem 0 0', color: 'var(--color-text-muted)' }}>
              AI-predicted prices for the next 14 days
            </p>
          </div>
          {cropLot && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(`/crop-lots/${cropLot.id}/market`)}
              style={{ fontSize: '0.8rem' }}
            >
              Full Report <ArrowUpRight size={14} />
            </button>
          )}
        </div>
        {loading || !forecast ? (
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner" style={{ width: 32, height: 32 }} />
          </div>
        ) : (
          <PriceChart forecast={forecast} height={220} />
        )}
        {/* Market comparison chips */}
        {!loading && marketPrices.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {marketPrices.map(mp => (
              <div key={mp.market_id} style={{
                background: 'var(--color-surface-700)',
                border: '1px solid var(--color-border)',
                borderRadius: 999, padding: '0.25rem 0.75rem',
                fontSize: '0.75rem', color: 'var(--color-text-secondary)',
                display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{mp.market_name}:</span>
                <strong>₹{mp.modal_price.toLocaleString('en-IN')}/q</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- SECTION 4: WHAT SHOULD I DO — AI Recommendation ---- */}
      {loading ? (
        <SkeletonCard />
      ) : recommendation ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
            <Brain size={18} color="var(--color-primary-400)" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>What Should I Do?</h3>
          </div>
          <AIRecommendationCard
            recommendation={recommendation}
            onAction={() => cropLot && navigate(`/crop-lots/${cropLot.id}/buyers`)}
          />
        </div>
      ) : null}

      {/* ---- SECTION 5: WHO SHOULD I SELL TO — Buyer Matches ---- */}
      {!loading && buyers.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--color-primary-400)" />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Who Should I Sell To?</h3>
            </div>
            {cropLot && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate(`/crop-lots/${cropLot.id}/buyers`)}
                style={{ fontSize: '0.8rem' }}
              >
                All {buyers.length} buyers <ArrowUpRight size={14} />
              </button>
            )}
          </div>
          {/* Show top 2 buyers horizontally on mobile */}
          <div className="scroll-cards" style={{ paddingBottom: '0.75rem' }}>
            {buyers.slice(0, 3).map((match, idx) => (
              <div key={match.buyer.id} style={{ width: 'min(88vw, 320px)' }}>
                <BuyerCard
                  match={match}
                  rank={idx + 1}
                  onContact={() => {
                    toast.info('Contact initiated', `Connecting you with ${match.buyer.name}`)
                    navigate(`/crop-lots/${cropLot?.id}/buyers`)
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- SECTION 6: WHAT HAPPENS NEXT — Journey Timeline ---- */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>What Happens Next?</h3>
        </div>
        <Timeline
          steps={JOURNEY_STEPS(cropLot?.status || 'quality_done')}
          orientation="horizontal"
        />
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '1rem', textAlign: 'center' }}>
          You are at <strong style={{ color: 'var(--color-primary-400)' }}>Buyer Matching</strong> — next step is to negotiate.
        </p>
      </div>

      {/* ---- Quick Actions ---- */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem',
      }}>
        {[
          { label: 'View Market Prices', icon: TrendingUp, color: '#22c55e', path: cropLot ? `/crop-lots/${cropLot.id}/market` : '/crop-lots' },
          { label: 'AI Recommendation', icon: Brain, color: '#f59e0b', path: cropLot ? `/crop-lots/${cropLot.id}/recommendation` : '/crop-lots' },
          { label: 'Find Buyers', icon: Users, color: '#a855f7', path: cropLot ? `/crop-lots/${cropLot.id}/buyers` : '/crop-lots' },
          { label: 'My Transactions', icon: Bell, color: '#3b82f6', path: '/transactions' },
        ].map(action => (
          <button
            key={action.label}
            className="card"
            style={{
              cursor: 'pointer', border: 'none',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              textAlign: 'left', background: 'var(--color-surface-800)',
              transition: 'all 200ms',
            }}
            onClick={() => navigate(action.path)}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: `${action.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <action.icon size={18} color={action.color} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {action.label}
            </span>
          </button>
        ))}
      </div>

    </div>
  )
}
