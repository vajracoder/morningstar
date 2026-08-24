// ============================================================
// MORNINGSTAR — MODAL COMPONENT
// ============================================================

import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  maxWidth?: number
}

export default function Modal({ open, onClose, title, children, footer, maxWidth = 560 }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-box"
        style={{ maxWidth }}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{title}</h3>
            <button
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.375rem', minHeight: 'unset', borderRadius: '50%' }}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
