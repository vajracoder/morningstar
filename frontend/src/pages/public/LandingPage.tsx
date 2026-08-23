// ============================================================
// MORNINGSTAR — LANDING PAGE
// Hero + Features + Stats + CTA
// ============================================================

import { useNavigate } from 'react-router-dom'
import {
  Leaf, TrendingUp, Brain, Users, Truck, ShieldCheck,
  IndianRupee, ArrowRight, Star, Wheat, BarChart3, Handshake,
} from 'lucide-react'

const FEATURES = [
  {
    icon: TrendingUp,
    color: '#22c55e',
    title: 'Live Market Intelligence',
    description: 'Real-time prices from 500+ APMC mandis. Know exactly what your crop is worth today.',
  },
  {
    icon: Brain,
    color: '#f59e0b',
    title: 'AI Sell/Wait Recommendation',
    description: 'Our AI analyses prices, storage costs, and spoilage risk to tell you the exact right moment to sell.',
  },
  {
    icon: Users,
    color: '#a855f7',
    title: 'Verified Buyer Matching',
    description: 'Get matched with verified buyers ranked by offered price, payment reliability, and distance.',
  },
  {
    icon: Handshake,
    color: '#3b82f6',
    title: 'Digital Negotiation',
    description: 'Negotiate directly with buyers on the platform. Counter offers, accept, and sign contracts digitally.',
  },
  {
    icon: Truck,
    color: '#f97316',
    title: 'Logistics Made Simple',
    description: 'Compare transport providers, book pickup, and track your shipment in real time.',
  },
  {
    icon: ShieldCheck,
    color: '#06b6d4',
    title: 'Secure & Trusted',
    description: 'Every buyer is verified. Every payment is tracked. Disputes resolved within 48 hours.',
  },
]

const STATS = [
  { value: '10,000+', label: 'Farmers Active' },
  { value: '₹45Cr+', label: 'Transactions Processed' },
  { value: '500+', label: 'APMC Markets Tracked' },
  { value: '94%', label: 'Farmer Satisfaction' },
]

const STEPS = [
  { step: '01', title: 'Create Crop Lot', description: 'Add your crop, quantity, and location' },
  { step: '02', title: 'AI Quality Grading', description: 'Upload image — AI grades your crop instantly' },
  { step: '03', title: 'Market Intelligence', description: 'See live prices and 14-day AI forecast' },
  { step: '04', title: 'Sell / Wait Decision', description: 'Get a clear recommendation with confidence score' },
  { step: '05', title: 'Buyer Matching', description: 'Top buyers ranked by price, trust, and payment speed' },
  { step: '06', title: 'Negotiate & Get Paid', description: 'Close the deal and receive payment digitally' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-surface-900)', overflowX: 'hidden' }}>

      {/* ---- Navbar ---- */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 1.5rem',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem' }}>
            MORNINGSTAR
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a href="/how-it-works" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
            How It Works
          </a>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </header>

      {/* ---- Hero Section ---- */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(4rem, 10vw, 7rem) 1.5rem clamp(3rem, 8vw, 6rem)',
        textAlign: 'center',
        background: 'linear-gradient(160deg, #0a0e1a 0%, #0f2d1a 45%, #0a1229 100%)',
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: '-15%', right: '-10%', width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%', width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="animate-fade-in" style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 999, padding: '0.375rem 1rem',
            fontSize: '0.8rem', fontWeight: 600, color: '#4ade80',
            marginBottom: '1.5rem',
          }}>
            <Star size={13} fill="#4ade80" color="#4ade80" />
            SIH 2026 — Problem Statement 26132
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.25rem, 7vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, #f1f5f9 30%, #4ade80 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Know When to Sell.<br />Get the Best Price.
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--color-text-secondary)',
            maxWidth: 560, margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            MorningStar is an AI-powered agricultural market intelligence platform that tells farmers
            exactly when to sell, who to sell to, and how to get paid on time.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/login')}
              style={{ gap: '0.625rem' }}
            >
              Start for Free <ArrowRight size={18} />
            </button>
            <a href="/how-it-works" className="btn btn-secondary btn-lg" style={{ textDecoration: 'none' }}>
              See How It Works
            </a>
          </div>

          {/* Trust row */}
          <div style={{
            display: 'flex', gap: '1.5rem', justifyContent: 'center',
            marginTop: '2.5rem', flexWrap: 'wrap',
          }}>
            {['🔒 OTP Verified Login', '🇮🇳 Made for Indian Farmers', '🌾 Grade A Quality AI'].map(t => (
              <span key={t} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Stats Strip ---- */}
      <section style={{
        background: 'var(--color-surface-800)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: '2rem 1.5rem',
      }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div className="price-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#4ade80' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Features Grid ---- */}
      <section style={{ padding: 'clamp(3rem, 8vw, 5rem) 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '0.75rem' }}>
              Everything a Farmer Needs
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 480, margin: '0 auto' }}>
              From market intelligence to payment — one platform handles the entire crop journey.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.375rem' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section style={{
        padding: 'clamp(3rem, 8vw, 5rem) 1.5rem',
        background: 'var(--color-surface-800)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '0.75rem' }}>
              Your Journey in 6 Steps
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              From crop lot creation to payment — the full cycle on one platform.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {STEPS.map((s, i) => (
              <div key={s.step} style={{
                display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
                padding: '1.25rem',
                background: 'var(--color-surface-700)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(22,163,74,0.2), rgba(34,197,94,0.1))',
                  border: '1px solid rgba(34,197,94,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: '0.875rem', color: '#4ade80',
                }}>
                  {s.step}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{s.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Demo Data Section ---- */}
      <section style={{ padding: 'clamp(3rem, 8vw, 5rem) 1.5rem' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '0.75rem' }}>
              See It In Action
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Here's what Rajesh from Nashik sees when he logs in.
            </p>
          </div>

          {/* Demo card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(22,163,74,0.08) 0%, var(--color-surface-800) 60%)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Wheat size={24} color="#4ade80" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Wheat — Grade A</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>100 quintal · Nashik, Maharashtra</div>
              </div>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem', marginBottom: '1.5rem',
            }}>
              {[
                { label: 'Today\'s Price', value: '₹2,480/q', color: '#4ade80', icon: IndianRupee },
                { label: '7-Day Forecast', value: '₹2,570/q', color: '#f59e0b', icon: TrendingUp },
                { label: 'Total Value', value: '₹2,48,000', color: '#3b82f6', icon: BarChart3 },
              ].map(item => (
                <div key={item.label} style={{
                  background: 'var(--color-surface-700)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  textAlign: 'center',
                }}>
                  <item.icon size={16} color={item.color} style={{ marginBottom: '0.375rem' }} />
                  <div className="price-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: item.color }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <Brain size={20} color="#fbbf24" />
              <div>
                <div style={{ fontWeight: 700, color: '#fbbf24' }}>AI Says: WAIT 7 DAYS</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Expected gain: ₹5,500 · Confidence: 78% · Risk: Medium
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section style={{
        padding: 'clamp(3rem, 8vw, 5rem) 1.5rem',
        background: 'linear-gradient(135deg, #0f2d1a 0%, #0a0e1a 100%)',
        textAlign: 'center',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '1rem' }}>
            Ready to Maximise Your Crop Value?
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Join 10,000+ farmers who use MorningStar to sell smarter, faster, and safer.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/login')}
          >
            Get Started Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer style={{
        background: 'var(--color-surface-800)',
        borderTop: '1px solid var(--color-border)',
        padding: '1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <Leaf size={16} color="#4ade80" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem' }}>MORNINGSTAR</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
          SIH 2026 — Team: Tilak, Kuldeep, Ishan · Agriculture + FinTech + AI + Trust
        </p>
      </footer>
    </div>
  )
}
