// ============================================================
// MORNINGSTAR — SKELETON LOADING COMPONENT
// ============================================================

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  className?: string
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 6, className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Skeleton width={40} height={40} borderRadius={10} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton height={14} />
      <Skeleton height={14} width="80%" />
      <Skeleton height={36} borderRadius={8} />
    </div>
  )
}

export function SkeletonStatCard() {
  return (
    <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Skeleton width="50%" height={12} />
      <Skeleton width="70%" height={28} />
      <Skeleton width="40%" height={12} />
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height={14} />
      ))}
    </div>
  )
}
