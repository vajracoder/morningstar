// ============================================================
// MORNINGSTAR — APP SHELL (Layout)
// Desktop sidebar + Mobile bottom navigation
// ============================================================

import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Wheat, TrendingUp, Brain, Users,
  Handshake, Receipt, Truck, Bell, User, LogOut, Leaf
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

const NAV_ITEMS = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/crop-lots',   icon: Wheat,            label: 'Crop Lots' },
  { to: '/transactions',icon: Receipt,           label: 'Transactions' },
  { to: '/notifications',icon: Bell,             label: 'Alerts', badge: '2' },
  { to: '/profile',     icon: User,              label: 'Profile' },
]

const SIDEBAR_ITEMS = [
  { section: 'Overview', items: [
    { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/notifications',icon: Bell,            label: 'Notifications', badge: '2' },
  ]},
  { section: 'My Crops', items: [
    { to: '/crop-lots',   icon: Wheat,            label: 'Crop Lots' },
  ]},
  { section: 'Intelligence', items: [
    { to: '/crop-lots/lot-001/market',         icon: TrendingUp, label: 'Market Prices' },
    { to: '/crop-lots/lot-001/recommendation', icon: Brain,      label: 'AI Recommendations' },
  ]},
  { section: 'Trade', items: [
    { to: '/crop-lots/lot-001/buyers',         icon: Users,      label: 'Find Buyers' },
    { to: '/negotiations/offer-001',           icon: Handshake,  label: 'Negotiations' },
    { to: '/transactions',                     icon: Receipt,    label: 'Transactions' },
    { to: '/logistics/txn-001',                icon: Truck,      label: 'Logistics' },
  ]},
  { section: 'Account', items: [
    { to: '/profile',     icon: User,             label: 'Profile' },
  ]},
]

export default function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-layout">
      {/* ---- Desktop Sidebar ---- */}
      <aside className="sidebar hide-mobile">
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Leaf size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                MORNINGSTAR
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Smart Farming Intelligence</div>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, #15803d, #16a34a)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.875rem', fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {user?.name?.charAt(0) || 'R'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Rajesh Patil'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Nashik, Maharashtra</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((section) => (
            <div key={section.section}>
              <div className="sidebar-section-label">{section.section}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-nav-item${isActive ? ' active' : ''}`
                  }
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      background: 'var(--color-primary-600)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.45rem',
                      borderRadius: 999,
                    }}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
          <button className="sidebar-nav-item" style={{ color: 'var(--color-red-400)' }} onClick={handleLogout}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ---- Main Content ---- */}
      <main className="app-main">
        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {/* ---- Mobile Bottom Navigation ---- */}
      <nav className="bottom-nav hide-desktop">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `bottom-nav-item${isActive ? ' active' : ''}`
            }
            style={{ position: 'relative' }}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
            {item.badge && (
              <span style={{
                position: 'absolute',
                top: 2,
                right: '25%',
                background: 'var(--color-primary-500)',
                color: '#fff',
                fontSize: '0.6rem',
                fontWeight: 700,
                width: 16,
                height: 16,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
