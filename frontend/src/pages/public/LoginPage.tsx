// ============================================================
// MORNINGSTAR — LOGIN PAGE
// OTP-based phone login
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Leaf, Phone, Shield, ArrowRight, Loader2 } from 'lucide-react'

type Step = 'phone' | 'otp'

export default function LoginPage() {
  const { login, requestOtp, loading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }
    try {
      await requestOtp(phone)
      setOtpSent(true)
      setStep('otp')
    } catch (err: any) {
      setError(err?.message || 'Failed to send OTP. Try again.')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!otp || otp.length < 4) {
      setError('Please enter the OTP sent to your phone.')
      return
    }
    try {
      await login(phone, otp)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Invalid OTP. Please try again.')
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #0a0e1a 0%, #0f2d1a 40%, #0a1229 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decorative orbs */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-10%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="animate-fade-in" style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 60, height: 60,
            background: 'linear-gradient(135deg, #15803d, #22c55e)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', boxShadow: '0 0 30px rgba(34,197,94,0.3)',
          }}>
            <Leaf size={28} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.375rem' }}>
            MORNINGSTAR
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Smart Farming Intelligence
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'var(--color-surface-800)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-xl)',
        }}>
          {step === 'phone' ? (
            <>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.375rem' }}>Welcome back</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Enter your registered mobile number
              </p>
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone-input">Mobile Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{
                      position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)', pointerEvents: 'none',
                    }} />
                    <input
                      id="phone-input"
                      className="form-input"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="9876543210"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      style={{ paddingLeft: '2.5rem' }}
                      autoComplete="tel"
                    />
                  </div>
                </div>
                {error && <p className="form-error">{error}</p>}
                <button
                  id="send-otp-btn"
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? <span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <ArrowRight size={18} />}
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '0.375rem', minHeight: 'unset' }}
                  onClick={() => { setStep('phone'); setError(''); setOtp(''); }}
                >←</button>
                <div>
                  <h2 style={{ fontSize: '1.25rem' }}>Enter OTP</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    Sent to +91-{phone}
                  </p>
                </div>
              </div>
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="otp-input">6-Digit OTP</label>
                  <div style={{ position: 'relative' }}>
                    <Shield size={16} style={{
                      position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)', pointerEvents: 'none',
                    }} />
                    <input
                      id="otp-input"
                      className="form-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                      style={{ paddingLeft: '2.5rem', letterSpacing: '0.2em', fontSize: '1.25rem', textAlign: 'center' }}
                      autoFocus
                      autoComplete="one-time-code"
                    />
                  </div>
                  {/* Demo hint */}
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-400)', marginTop: '0.25rem' }}>
                    🔧 Demo mode: enter any 6 digits
                  </p>
                </div>
                {error && <p className="form-error">{error}</p>}
                <button
                  id="verify-otp-btn"
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading || otp.length < 6}
                >
                  {loading ? <span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : null}
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}
                  onClick={handleSendOtp}
                >
                  Resend OTP
                </button>
              </form>
            </>
          )}
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {['🔒 Secure OTP Login', '🇮🇳 Made for India', '🌾 Farmer First'].map(badge => (
            <span key={badge} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{badge}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
