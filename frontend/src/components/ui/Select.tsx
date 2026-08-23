// ============================================================
// MORNINGSTAR — SELECT COMPONENT
// Reusable form select with label, error, and options list support.
// ============================================================

import { type SelectHTMLAttributes, useId } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helper?: string
  options: SelectOption[]
  placeholder?: string
  /** Optional container class */
  wrapperClassName?: string
}

export default function Select({
  label,
  error,
  helper,
  options,
  placeholder,
  id,
  className = '',
  wrapperClassName = '',
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={`form-group ${wrapperClassName}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
          {props.required && (
            <span style={{ color: 'var(--color-danger)', marginLeft: '0.25rem' }} aria-hidden="true">*</span>
          )}
        </label>
      )}

      <select
        id={selectId}
        className={`form-select ${className}`}
        style={{
          borderColor: error ? 'var(--color-danger)' : undefined,
        }}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${selectId}-error` : helper ? `${selectId}-helper` : undefined
        }
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${selectId}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
      {!error && helper && (
        <p
          id={`${selectId}-helper`}
          style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}
        >
          {helper}
        </p>
      )}
    </div>
  )
}
