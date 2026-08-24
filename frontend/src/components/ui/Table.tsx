// ============================================================
// MORNINGSTAR — TABLE COMPONENT
// Responsive data table with optional sort, empty state, and
// loading skeleton. Wraps in a horizontally-scrollable container.
// ============================================================

import type { ReactNode } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { EmptyState } from './index'
import { SkeletonText } from './Skeleton'

export interface TableColumn<T> {
  key: string
  header: string
  /** Render a custom cell; receives the row object */
  render?: (row: T) => ReactNode
  /** If provided, column is sortable */
  sortable?: boolean
  /** Align cell content */
  align?: 'left' | 'center' | 'right'
  /** Min-width in px */
  minWidth?: number
}

export interface SortState {
  key: string
  direction: 'asc' | 'desc'
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  /** Unique key per row */
  rowKey: keyof T
  loading?: boolean
  /** Number of skeleton rows while loading */
  skeletonRows?: number
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: ReactNode
  sort?: SortState
  onSort?: (key: string) => void
  /** Extra class on the wrapper */
  className?: string
}

function SortIcon({ columnKey, sort }: { columnKey: string; sort?: SortState }) {
  if (!sort || sort.key !== columnKey) {
    return <ChevronsUpDown size={12} style={{ opacity: 0.4 }} />
  }
  return sort.direction === 'asc'
    ? <ChevronUp size={12} style={{ color: 'var(--color-primary-400)' }} />
    : <ChevronDown size={12} style={{ color: 'var(--color-primary-400)' }} />
}

export default function Table<T extends object>({
  columns,
  data,
  rowKey,
  loading = false,
  skeletonRows = 4,
  emptyTitle = 'No data',
  emptyDescription = 'Nothing to show here yet.',
  emptyIcon,
  sort,
  onSort,
  className = '',
}: TableProps<T>) {
  const alignStyle = (align?: 'left' | 'center' | 'right'): React.CSSProperties => ({
    textAlign: align ?? 'left',
  })

  return (
    <div className={`table-wrapper ${className}`}>
      <table className="table" aria-busy={loading}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  ...alignStyle(col.align),
                  minWidth: col.minWidth,
                  cursor: col.sortable && onSort ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
                onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                aria-sort={
                  sort?.key === col.key
                    ? sort.direction === 'asc' ? 'ascending' : 'descending'
                    : col.sortable ? 'none' : undefined
                }
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  {col.header}
                  {col.sortable && onSort && (
                    <SortIcon columnKey={col.key} sort={sort} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    <SkeletonText lines={1} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 0 }}>
                <EmptyState
                  title={emptyTitle}
                  description={emptyDescription}
                  icon={emptyIcon}
                />
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={String(row[rowKey])}>
                {columns.map((col) => (
                  <td key={col.key} style={alignStyle(col.align)}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
