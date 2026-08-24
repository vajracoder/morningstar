// ============================================================
// MORNINGSTAR — CROP LOTS PAGE
// List of all crop lots with status, grade, and quick actions
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Wheat, Package, MapPin, Calendar, ChevronRight,
  Search, Filter, Sprout,
} from 'lucide-react'
import { getCropLots } from '@/api/crops'
import { Badge, Button, EmptyState, SkeletonCard, useToast } from '@/components/ui'
import type { CropLot, CropLotStatus } from '@/types'

const STATUS_CONFIG: Record<CropLotStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  draft:           { label: 'Draft',           variant: 'neutral'  },
  quality_pending: { label: 'Grading...',      variant: 'warning'  },
  quality_done:    { label: 'Graded',          variant: 'success'  },
  listed:          { label: 'Listed',          variant: 'info'     },
  negotiating:     { label: 'Negotiating',     variant: 'warning'  },
  sold:            { label: 'Sold',            variant: 'success'  },
  expired:         { label: 'Expired',         variant: 'neutral'  },
}

const GRADE_COLORS: Record<string, string> = {
  A: '#4ade80', B: '#fbbf24', C: '#f87171', ungraded: '#94a3b8',
}

function LotCard({ lot, onClick }: { lot: CropLot; onClick: () => void }) {
  const statusCfg = STATUS_CONFIG[lot.status]
  const gradeColor = GRADE_COLORS[lot.grade]

  return (
    <div
      className="card"
      style={{ cursor: 'pointer', transition: 'all 200ms' }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', minWidth: 0 }}>
          {/* Icon */}
          <div style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(34,197,94,0.08))',
            border: '1px solid rgba(34,197,94,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Wheat size={22} color="#4ade80" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                {lot.crop_name}
              </span>
              {lot.variety && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  ({lot.variety})
                </span>
              )}
              {lot.grade !== 'ungraded' && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, color: gradeColor,
                  background: `${gradeColor}18`, borderRadius: 999,
                  padding: '0.15rem 0.5rem', border: `1px solid ${gradeColor}30`,
                }}>
                  Grade {lot.grade}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.375rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <Package size={12} /> {lot.quantity_quintal}q
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <MapPin size={12} /> {lot.location}
              </span>
              {lot.harvest_date && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <Calendar size={12} />
                  {new Date(lot.harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
          <ChevronRight size={16} color="var(--color-text-muted)" />
        </div>
      </div>
    </div>
  )
}

export default function CropLotsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [lots, setLots] = useState<CropLot[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    try {
      const data = await getCropLots()
      setLots(data)
    } catch (err: any) {
      toast.error('Failed to load crop lots', err?.message)
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { load() }, [load])

  const filtered = lots.filter(l =>
    l.crop_name.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, margin: 0 }}>My Crop Lots</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {loading ? 'Loading...' : `${lots.length} lot${lots.length !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/crop-lots/new')}>
          <Plus size={16} /> New Lot
        </button>
      </div>

      {/* Search */}
      {!loading && lots.length > 0 && (
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{
            position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)', pointerEvents: 'none',
          }} />
          <input
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by crop or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        lots.length === 0 ? (
          <EmptyState
            icon={<Sprout size={40} />}
            title="No Crop Lots Yet"
            description="Add your first crop lot to start getting AI-powered market intelligence and buyer matches."
            action={
              <Button variant="primary" size="sm" onClick={() => navigate('/crop-lots/new')}>
                <Plus size={16} /> Create Crop Lot
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<Filter size={36} />}
            title="No Results"
            description={`No lots match "${search}". Try a different search term.`}
          />
        )
      ) : (
        <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {filtered.map(lot => (
            <LotCard key={lot.id} lot={lot} onClick={() => navigate(`/crop-lots/${lot.id}`)} />
          ))}
        </div>
      )}
    </div>
  )
}
