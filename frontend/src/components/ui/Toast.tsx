// ============================================================
// MORNINGSTAR — TOAST NOTIFICATION SYSTEM
// ============================================================

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'warning' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastContextValue {
  success: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
}

const COLORS: Record<ToastType, string> = {
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-danger)',
  info: 'var(--color-info)',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((type: ToastType, title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev.slice(-4), { id, type, title, message }])
    setTimeout(() => remove(id), 4500)
  }, [remove])

  const ctx: ToastContextValue = {
    success: (t, m) => add('success', t, m),
    warning: (t, m) => add('warning', t, m),
    error: (t, m) => add('error', t, m),
    info: (t, m) => add('info', t, m),
  }

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map(toast => {
          const Icon = ICONS[toast.type]
          return (
            <div key={toast.id} className={`toast toast-${toast.type}`} role="alert">
              <Icon size={18} color={COLORS[toast.type]} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                  {toast.title}
                </div>
                {toast.message && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.125rem' }}>
                    {toast.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => remove(toast.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text-muted)', padding: '0.125rem',
                  flexShrink: 0,
                }}
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
