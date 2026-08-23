// ============================================================
// MORNINGSTAR — DRAWER COMPONENT
// Mobile-first bottom sheet drawer. Renders as a portal.
// On desktop the same component works as a side panel if needed.
// ============================================================

import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  /** Height cap (default: 90dvh) */
  maxHeight?: string
  /** Show the drag handle bar */
  showHandle?: boolean
}

export default function Drawer({
  open,
  onClose,
  title,
  children,
  maxHeight = '90dvh',
  showHandle = true,
}: DrawerProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="drawer-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ maxHeight }}
      >
        {showHandle && <div className="drawer-handle" aria-hidden="true" />}

        {title && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem 0.75rem',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>{title}</h3>
            <button
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              aria-label="Close drawer"
              style={{ padding: '0.375rem', minHeight: 'unset', borderRadius: '50%' }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </>,
    document.body
  )
}
