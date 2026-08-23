// ============================================================
// MORNINGSTAR — PRICE CHART COMPONENT
// Recharts-based area chart for price forecast visualization
// ============================================================

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'
import type { PriceForecast } from '@/types'

interface PriceChartProps {
  forecast: PriceForecast
  height?: number
}

interface ChartDataPoint {
  name: string
  price: number
  lower: number
  upper: number
  isForecast: boolean
}

function formatPrice(v: number) {
  return `₹${v.toLocaleString('en-IN')}`
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    const data = payload[0]?.payload as ChartDataPoint
    return (
      <div style={{
        background: 'var(--color-surface-700)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem',
        boxShadow: 'var(--shadow-lg)',
        fontSize: '0.8rem',
      }}>
        <p style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{label}</p>
        {payload.map((entry: any) => (
          entry.name !== 'Range' && (
            <p key={entry.name} style={{ color: entry.color || 'var(--color-text-secondary)' }}>
              {entry.name}: <strong>{formatPrice(entry.value)}</strong>
            </p>
          )
        ))}
        {data?.isForecast && data.lower && data.upper && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
            Range: {formatPrice(data.lower)} – {formatPrice(data.upper)}
          </p>
        )}
      </div>
    )
  }
  return null
}

export default function PriceChart({ forecast, height = 220 }: PriceChartProps) {
  // Build chart data: current + each forecast point
  const data: ChartDataPoint[] = [
    {
      name: 'Today',
      price: forecast.current_price,
      lower: forecast.current_price,
      upper: forecast.current_price,
      isForecast: false,
    },
    ...forecast.forecasts.map(f => ({
      name: `Day ${f.days}`,
      price: f.predicted_price,
      lower: f.lower_bound,
      upper: f.upper_bound,
      isForecast: true,
    })),
  ]

  const maxPrice = Math.max(...data.map(d => d.upper)) + 100
  const minPrice = Math.min(...data.map(d => d.lower)) - 100

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.08} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `₹${v}`}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            x="Today"
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 4"
            label={{ value: 'Now', fill: '#64748b', fontSize: 11, position: 'top' }}
          />
          {/* Confidence range area */}
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="url(#rangeGradient)"
            fillOpacity={1}
            name="Range"
            legendType="none"
          />
          {/* Main price line */}
          <Area
            type="monotone"
            dataKey="price"
            stroke="#22c55e"
            strokeWidth={2.5}
            fill="url(#priceGradient)"
            fillOpacity={1}
            dot={{ fill: '#22c55e', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#4ade80', strokeWidth: 2, stroke: '#15803d' }}
            name="Price"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
