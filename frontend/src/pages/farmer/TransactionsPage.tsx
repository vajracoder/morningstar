// ============================================================
// MORNINGSTAR — TRANSACTIONS PAGE
// Completed & in-progress trade deals, fulfillment tracking,
// payment UTR receipts, and logistics linkage
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Receipt, Truck, CheckCircle2
} from 'lucide-react'
import { getTransactions } from '@/api/transactions'
import {
  Button, Badge, Timeline, SkeletonCard,
  EmptyState, useToast
} from '@/components/ui'
import type { TimelineStep } from '@/components/ui'
import type { Transaction, TransactionStatus } from '@/types'

const STATUS_CONFIG: Record<TransactionStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  initiated:         { label: 'Initiated',         variant: 'neutral' },
  contract_signed:   { label: 'Contract Signed',   variant: 'info'    },
  pickup_scheduled:  { label: 'Pickup Booked',     variant: 'warning' },
  in_transit:        { label: 'In Transit',        variant: 'info'    },
  delivered:         { label: 'Delivered',         variant: 'success' },
  payment_pending:   { label: 'Payment Pending',   variant: 'warning' },
  payment_done:      { label: 'Payment Done',      variant: 'success' },
  disputed:          { label: 'Disputed',          variant: 'danger'  },
  completed:         { label: 'Completed',         variant: 'success' },
}

const getTimelineSteps = (status: TransactionStatus): TimelineStep[] => {
  return [
    {
      id: '1',
      label: 'Offer Accepted',
      description: 'Deal agreed at ₹2,600/q',
      status: 'done',
    },
    {
      id: '2',
      label: 'Digital Contract',
      description: 'Signed by Farmer & ABC Foods',
      status: 'done',
    },
    {
      id: '3',
      label: 'Pickup & Transport',
      description: 'Shree Transport dispatched',
      status: 'done',
    },
    {
      id: '4',
      label: 'Delivery & Inspection',
      description: 'Delivered & Grade A verified',
      status: 'done',
    },
    {
      id: '5',
      label: 'Payment Settled',
      description: '₹2,60,000 received via NEFT',
      status: status === 'payment_done' || status === 'completed' ? 'done' : 'active',
    },
  ]
}

export default function TransactionsPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTransactions()
      setTransactions(data)
    } catch (err: any) {
      toast.error('Failed to load transactions', err?.message)
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, margin: 0 }}>
            Transactions & Payments
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
            Track order fulfillment, payment settlements, and transport logistics
          </p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon={<Receipt size={40} />}
          title="No Transactions Yet"
          description="Once you accept an offer from a buyer, your deal contracts and payment receipts will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {transactions.map((txn) => {
            const statusCfg = STATUS_CONFIG[txn.status]
            return (
              <div
                key={txn.id}
                className="card"
                style={{
                  background: 'linear-gradient(135deg, rgba(22,163,74,0.06) 0%, var(--color-surface-800) 70%)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                {/* Top Row: Info + Value */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, #15803d, #22c55e)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0,
                    }}>
                      <Receipt size={24} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                          Wheat (Lok-1) — 100 Quintals
                        </h3>
                        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Buyer: <strong>ABC Foods Pvt Ltd</strong> · Txn #{txn.id} · {new Date(txn.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Final Deal Value</div>
                    <div className="price-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4ade80' }}>
                      ₹{txn.total_amount.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      ₹{txn.final_price}/q · {txn.final_quantity}q
                    </div>
                  </div>
                </div>

                {/* Fulfillment Timeline */}
                <div style={{
                  background: 'var(--color-surface-700)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                }}>
                  <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem' }}>Order Fulfillment Journey</h4>
                  <Timeline steps={getTimelineSteps(txn.status)} orientation="horizontal" />
                </div>

                {/* Payment & Logistics Strip */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem',
                }}>
                  {/* Payment Receipt */}
                  <div style={{
                    background: 'rgba(34,197,94,0.08)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80', fontWeight: 700, fontSize: '0.85rem' }}>
                      <CheckCircle2 size={16} /> Payment Receipt Settled
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      Amount: <strong style={{ color: '#fff' }}>₹2,60,000</strong> via Bank Transfer (NEFT)<br />
                      UTR Number: <code style={{ color: '#4ade80' }}>UTR26082200001</code>
                    </div>
                  </div>

                  {/* Transport Linkage */}
                  <div style={{
                    background: 'var(--color-surface-700)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Shree Transport (10T Truck)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Delivered to ABC Foods Nashik Unit
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/logistics/${txn.id}`)}
                      icon={<Truck size={14} />}
                    >
                      Logistics
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
