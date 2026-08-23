// ============================================================
// MORNINGSTAR — PROFILE PAGE
// Farmer identity, Kisan Credit Card (KCC), Aadhaar KYC,
// landholding stats, and security settings
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Phone, MapPin, ShieldCheck, LogOut
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button, Badge, useToast } from '@/components/ui'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [farmerData] = useState({
    name: user?.name || 'Rajesh Patil',
    phone: user?.phone || '+91-9876543210',
    email: user?.email || 'rajesh.patil@example.com',
    location: 'Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    total_land_acres: 12,
    kcc_number: 'KCC-MH-2024-001',
    aadhaar_verified: true,
    member_since: 'January 2026',
    trust_score: 98,
  })

  const handleLogout = () => {
    logout()
    toast.info('Logged out', 'You have been signed out of MorningStar.')
    navigate('/login')
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, margin: 0 }}>
          Farmer Profile & KYC
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
          Manage your verified credentials, farm registration, and banking details
        </p>
      </div>

      {/* Profile Identity Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(22,163,74,0.1) 0%, var(--color-surface-800) 70%)',
        border: '1px solid rgba(34,197,94,0.25)',
        padding: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #15803d, #22c55e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#fff',
            boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
            flexShrink: 0,
          }}>
            {farmerData.name.charAt(0)}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                {farmerData.name}
              </h2>
              <Badge variant="success">
                <ShieldCheck size={12} /> Aadhaar KYC Verified
              </Badge>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Phone size={13} /> {farmerData.phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={13} /> {farmerData.district}, {farmerData.state}
              </span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Farmer Trust Rating</div>
          <div className="price-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4ade80' }}>
            {farmerData.trust_score}/100
          </div>
          <div style={{ fontSize: '0.7rem', color: '#4ade80' }}>Tier 1 Verified Producer</div>
        </div>
      </div>

      {/* Farm & Landholding Stats */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem' }}>Farm & Landholding Details</h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          <div style={{ background: 'var(--color-surface-700)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
              Total Cultivated Land
            </div>
            <div className="price-display" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {farmerData.total_land_acres} Acres
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Irrigated farm holding</span>
          </div>

          <div style={{ background: 'var(--color-surface-700)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
              Kisan Credit Card (KCC)
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#4ade80' }}>
              {farmerData.kcc_number}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Bank of Maharashtra linked</span>
          </div>

          <div style={{ background: 'var(--color-surface-700)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
              Primary Crops
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
              Wheat, Soybean, Onion
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Rabi & Kharif cycles</span>
          </div>
        </div>
      </div>

      {/* Account Settings & Sign Out */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Account & Security</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Signed in on this device via Secure OTP Authentication.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <Button
            variant="danger"
            onClick={handleLogout}
            icon={<LogOut size={16} />}
          >
            Sign Out of MorningStar
          </Button>
        </div>
      </div>
    </div>
  )
}
