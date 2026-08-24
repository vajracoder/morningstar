// ============================================================
// MORNINGSTAR — HOW IT WORKS PAGE
// Step-by-step journey explainer for new users
// ============================================================

import { useNavigate } from 'react-router-dom'
import {
  Leaf, Wheat, Camera, BarChart3, Brain, Users,
  Handshake, Truck, IndianRupee, ArrowRight, CheckCircle2,
} from 'lucide-react'

const STEPS = [
  {
    step: 1,
    icon: Wheat,
    color: '#22c55e',
    title: 'Create Your Crop Lot',
    description: 'Enter your crop name, variety, quantity in quintals, and your location. Takes less than 2 minutes.',
    details: ['Select from 50+ crop types', 'Auto-detect nearby APMC mandis', 'Set storage capacity & type'],
  },
  {
    step: 2,
    icon: Camera,
    color: '#f59e0b',
    title: 'AI Quality Grading',
    description: 'Upload a photo of your crop. Our AI analyses it and assigns a quality grade (A, B, or C) in seconds.',
    details: ['93% accuracy vs manual grading', 'Checks moisture, protein, impurity', 'Generates a quality certificate'],
  },
  {
    step: 3,
    icon: BarChart3,
    color: '#3b82f6',
    title: 'Market Intelligence',
    description: 'See today\'s prices from 500+ APMC mandis in your region, along with arrival data and trend analysis.',
    details: ['Real-time price from 500+ APMCs', 'Historical price comparison', 'Seasonal trend analysis'],
  },
  {
    step: 4,
    icon: Brain,
    color: '#a855f7',
    title: 'AI Sell / Wait Recommendation',
    description: 'The AI factors in price forecast, storage cost, and spoilage risk to give you a clear SELL or WAIT decision with confidence score.',
    details: ['14-day price forecast', 'Net realisation comparison', 'Risk level indicator'],
  },
  {
    step: 5,
    icon: Users,
    color: '#f97316',
    title: 'Buyer Matching',
    description: 'Get matched with verified buyers ranked by offered price, payment reliability, distance, and trust score.',
    details: ['All buyers are Aadhaar/GST verified', 'Payment reliability score', 'Average payment cycle shown'],
  },
  {
    step: 6,
    icon: Handshake,
    color: '#06b6d4',
    title: 'Negotiate & Close the Deal',
    description: 'Negotiate directly on the platform. Counter offers, accept, and sign a digital contract.',
    details: ['Complete negotiation thread', 'Digital contract signing', 'Dispute resolution support'],
  },
  {
    step: 7,
    icon: Truck,
    color: '#ef4444',
    title: 'Logistics Arranged',
    description: 'Compare transport providers, book pickup from your farm, and track delivery to the buyer.',
    details: ['Multiple transport options', 'Real-time shipment tracking', 'Cost comparison'],
  },
  {
    step: 8,
    icon: IndianRupee,
    color: '#4ade80',
    title: 'Get Paid Securely',
    description: 'Payment is tracked on the platform. Receive via UPI or bank transfer. UTR confirmation saved.',
    details: ['UPI / NEFT / Bank Transfer', 'Payment confirmation with UTR', 'Payment protection for disputes'],
  },
]

export default function HowItWorksPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-surface-900)' }}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 1.5rem',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-text-primary)' }}>
            MORNINGSTAR
          </span>
        </a>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
          Get Started <ArrowRight size={14} />
        </button>
      </header>

      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: 'clamp(3rem, 8vw, 5rem) 1.5rem 2rem',
        background: 'linear-gradient(160deg, #0a0e1a 0%, #0f2d1a 50%, #0a1229 100%)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', marginBottom: '1rem' }}>
          How MorningStar Works
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: 520, margin: '0 auto 2rem', fontSize: '1.1rem' }}>
          From crop lot to payment — a complete 8-step journey designed for Indian farmers.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 999, padding: '0.5rem 1.25rem',
          fontSize: '0.875rem', color: '#4ade80',
        }}>
          <CheckCircle2 size={15} />
          Demo: Rajesh Patil · 100q Wheat · Nashik
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: 'clamp(2rem, 6vw, 4rem) 1.5rem' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {STEPS.map((s, i) => (
              <div
                key={s.step}
                className="card animate-fade-in"
                style={{
                  animationDelay: `${i * 0.06}s`,
                  display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
                  padding: '1.5rem',
                }}
              >
                {/* Step number + icon */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <s.icon size={24} color={s.color} />
                  </div>
                  <div style={{
                    fontSize: '0.7rem', fontWeight: 700, color: s.color,
                    background: `${s.color}15`, borderRadius: 999,
                    padding: '0.15rem 0.5rem', letterSpacing: '0.05em',
                  }}>
                    STEP {s.step}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.875rem', lineHeight: 1.65 }}>
                    {s.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {s.details.map(d => (
                      <span key={d} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        fontSize: '0.75rem', fontWeight: 500,
                        background: 'var(--color-surface-700)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 999, padding: '0.25rem 0.625rem',
                        color: 'var(--color-text-muted)',
                      }}>
                        <CheckCircle2 size={11} color="#4ade80" />
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        textAlign: 'center',
        padding: 'clamp(3rem, 8vw, 5rem) 1.5rem',
        background: 'linear-gradient(135deg, #0f2d1a 0%, #0a0e1a 100%)',
        borderTop: '1px solid var(--color-border)',
      }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '1rem' }}>
          Ready to Start Your Journey?
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          Create your first crop lot in under 2 minutes.
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
          Get Started Free <ArrowRight size={18} />
        </button>
      </section>
    </div>
  )
}
