// ============================================================
// MORNINGSTAR — NOTIFICATIONS PAGE
// Real-time market alerts, buyer proposals, and payment updates
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, TrendingUp, Brain, Users, IndianRupee,
  CheckCheck, ArrowRight, ShieldCheck
} from 'lucide-react'
import { MOCK_NOTIFICATIONS } from '@/mock/data'
import { Button, Badge, EmptyState, useToast } from '@/components/ui'
import type { Notification, NotificationType } from '@/types'

const TYPE_ICONS: Record<NotificationType, { icon: any; color: string; bg: string }> = {
  price_alert:       { icon: TrendingUp,   color: '#22c55e', bg: 'rgba(34,197,94,0.1)'  },
  offer_received:    { icon: Users,        color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  offer_accepted:    { icon: CheckCheck,   color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  payment_received:  { icon: IndianRupee,  color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  recommendation:    { icon: Brain,        color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  general:           { icon: Bell,         color: '#94a3b8', bg: 'rgba(148,163,184,0.1)'},
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<string>('all')

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('Marked as read', 'All notifications marked as read.')
  }

  const handleItemClick = (n: Notification) => {
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))
    if (n.action_url) {
      navigate(n.action_url)
    }
  }

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter !== 'all') return n.type === filter
    return true
  })

  return (
    <div className="animate-fade-in" style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, margin: 0 }}>
            Notifications & Alerts
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
            Instant price movements, AI Sell/Wait triggers, and buyer deal updates
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleMarkAllRead}
          icon={<CheckCheck size={16} />}
        >
          Mark all as read
        </Button>
      </div>

      {/* Filter Chips */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
      }}>
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: 'Unread' },
          { id: 'recommendation', label: 'AI Advice' },
          { id: 'offer_received', label: 'Buyer Offers' },
          { id: 'payment_received', label: 'Payments' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn btn-sm ${filter === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell size={36} />}
          title="No Notifications"
          description="You're all caught up! New price alerts and trade updates will show up here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(n => {
            const typeConfig = TYPE_ICONS[n.type] || TYPE_ICONS.general
            const Icon = typeConfig.icon
            return (
              <div
                key={n.id}
                className="card"
                style={{
                  padding: '1.15rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  cursor: 'pointer',
                  background: n.read ? 'var(--color-surface-800)' : 'linear-gradient(135deg, rgba(22,163,74,0.08) 0%, var(--color-surface-800) 100%)',
                  border: n.read ? '1px solid var(--color-border)' : '1px solid rgba(34,197,94,0.3)',
                  transition: 'all 200ms',
                }}
                onClick={() => handleItemClick(n)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: typeConfig.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={20} color={typeConfig.color} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: n.read ? 'var(--color-text-primary)' : '#4ade80' }}>
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: 'var(--color-primary-500)',
                          display: 'inline-block',
                        }} />
                      )}
                    </div>

                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                      {n.message}
                    </p>

                    <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {n.action_url && (
                  <ArrowRight size={16} color="var(--color-text-muted)" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
