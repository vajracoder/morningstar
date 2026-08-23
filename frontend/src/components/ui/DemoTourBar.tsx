// ============================================================
// MORNINGSTAR — INTERACTIVE DEMO TOUR BAR (Judge Evaluator Mode)
// Quick 1-click step-through for the 12-stage North Star journey,
// plus instant mock data reset.
// ============================================================

import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Sparkles, ChevronUp, ChevronDown, RotateCcw,
  CheckCircle2, ArrowRight, X, Play, Shield
} from 'lucide-react'
import { resetDemoData } from '@/mock/mockStorage'
import { useToast } from './Toast'

const DEMO_STEPS = [
  { id: 1,  label: '1. Dashboard',          path: '/dashboard',                 desc: 'Command center answering "What should I do?"' },
  { id: 2,  label: '2. Crop Lots',          path: '/crop-lots',                 desc: 'Registered harvest inventory' },
  { id: 3,  label: '3. Create Lot',         path: '/crop-lots/new',             desc: 'Register new harvest with image sample' },
  { id: 4,  label: '4. Quality Grade',      path: '/crop-lots/lot-001',         desc: 'AI Grade A Report (Moisture, Protein)' },
  { id: 5,  label: '5. Market Prices',      path: '/crop-lots/lot-001/market',  desc: 'Live APMCs + 14-day AI forecast chart' },
  { id: 6,  label: '6. Sell / Wait Advice', path: '/crop-lots/lot-001/recommendation', desc: 'WAIT 7 Days (+₹5,500 net realisation)' },
  { id: 7,  label: '7. Buyer Matching',     path: '/crop-lots/lot-001/buyers',  desc: 'Ranked institutional buyers (ABC Foods 94%)' },
  { id: 8,  label: '8. Negotiation',        path: '/negotiations/offer-001',    desc: 'Counter-offer thread & contract acceptance' },
  { id: 9,  label: '9. Transactions',       path: '/transactions',              desc: 'Lifecycle timeline & NEFT UTR receipt' },
  { id: 10, label: '10. Logistics',         path: '/logistics/txn-001',         desc: 'Shree Transport 10T truck tracking' },
  { id: 11, label: '11. Alerts',            path: '/notifications',             desc: 'Real-time price & deal notifications' },
  { id: 12, label: '12. KYC & Trust',       path: '/profile',                   desc: 'Aadhaar verified, KCC card, 98/100 score' },
]

export default function DemoTourBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const [expanded, setExpanded] = useState(false)
  const [minimized, setMinimized] = useState(false)

  const handleStepClick = (path: string, label: string) => {
    navigate(path)
    toast.info('Demo Step Active', label)
  }

  const handleResetData = () => {
    resetDemoData()
    toast.success('Demo Data Reset', 'Initial state restored. Reloading...')
    setTimeout(() => {
      window.location.reload()
    }, 400)
  }

  const currentStep = DEMO_STEPS.find(s => location.pathname === s.path)

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '1rem',
          zIndex: 999,
          background: 'linear-gradient(135deg, #15803d, #22c55e)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 999,
          padding: '0.5rem 1rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        <Sparkles size={14} /> SIH Demo Tour
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '4.5rem',
        right: '1rem',
        zIndex: 999,
        maxWidth: 380,
        width: 'calc(100vw - 2rem)',
        background: 'var(--color-surface-800)',
        border: '1px solid rgba(34,197,94,0.35)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(22,163,74,0.2) 0%, var(--color-surface-700) 100%)',
          padding: '0.625rem 0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border)',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: 'var(--color-primary-600)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
          }}>
            <Sparkles size={12} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              SIH 2026 Evaluator Tour
            </span>
            {currentStep && (
              <span style={{ fontSize: '0.7rem', color: '#4ade80', marginLeft: '0.35rem' }}>
                ({currentStep.label})
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.2rem 0.4rem', minHeight: 'unset' }}
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.2rem 0.4rem', minHeight: 'unset' }}
            onClick={(e) => {
              e.stopPropagation()
              setMinimized(true)
            }}
            title="Minimize"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Expanded Step List */}
      {expanded && (
        <div style={{
          maxHeight: 280,
          overflowY: 'auto',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}>
          {DEMO_STEPS.map((s) => {
            const isActive = location.pathname === s.path
            return (
              <button
                key={s.id}
                onClick={() => handleStepClick(s.path, s.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.625rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? '1px solid rgba(34,197,94,0.4)' : '1px solid transparent',
                  background: isActive ? 'rgba(34,197,94,0.12)' : 'transparent',
                  color: isActive ? '#4ade80' : 'var(--color-text-primary)',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 150ms',
                }}
              >
                <div>
                  <div>{s.label}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                    {s.desc}
                  </div>
                </div>
                <ArrowRight size={12} style={{ opacity: isActive ? 1 : 0.4, flexShrink: 0 }} />
              </button>
            )
          })}
        </div>
      )}

      {/* Bottom Footer Actions */}
      <div style={{
        padding: '0.5rem 0.875rem',
        background: 'var(--color-surface-900)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.7rem',
      }}>
        <span style={{ color: 'var(--color-text-muted)' }}>
          12 North Star Milestones
        </span>
        <button
          onClick={handleResetData}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontSize: '0.7rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: 0,
          }}
          title="Reset to demo state"
        >
          <RotateCcw size={11} /> Reset Data
        </button>
      </div>
    </div>
  )
}
