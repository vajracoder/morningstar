// ============================================================
// MORNINGSTAR — INPUT COMPONENT
// Reusable form input with label, error, helper text, and icon support.
// ============================================================

import { type InputHTMLAttributes, type ReactNode, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
  /** Optional container class */
  wrapperClassName?: string
}

export default function Input({
  label,
  error,
  helper,
  iconLeft,
  iconRight,
  id,
  className = '',
  wrapperClassName = '',
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={`form-group ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {props.required && (
            <span style={{ color: 'var(--color-danger)', marginLeft: '0.25rem' }} aria-hidden="true">*</span>
          )}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {iconLeft && (
          <span style={{
            position: 'absolute', left: '0.875rem',
            color: 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', pointerEvents: 'none',
            zIndex: 1,
          }}>
            {iconLeft}
          </span>
        )}

        <input
          id={inputId}
          className={`form-input ${error ? 'input-error' : ''} ${className}`}
          style={{
            paddingLeft: iconLeft ? '2.5rem' : undefined,
            paddingRight: iconRight ? '2.5rem' : undefined,
            borderColor: error ? 'var(--color-danger)' : undefined,
          }}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {iconRight && (
          <span style={{
            position: 'absolute', right: '0.875rem',
            color: 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center',
          }}>
            {iconRight}
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
      {!error && helper && (
        <p id={`${inputId}-helper`} style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          {helper}
        </p>
      )}
    </div>
  )
}
