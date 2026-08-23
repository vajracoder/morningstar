// ============================================================
// MORNINGSTAR — PRICE CHART COMPONENT (Production FinTech Standard)
// ============================================================

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
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
        background: 'var(--color-surface-800)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        boxShadow: 'var(--shadow-lg)',
        fontSize: '0.8rem',
      }}>
        <p style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>{label}</p>
        <p style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.95rem', margin: '0 0 0.25rem' }}>
          {formatPrice(data?.price || payload[0]?.value)}
        </p>
        {data?.isForecast && data.lower && data.upper && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', margin: 0 }}>
            Confidence Range: {formatPrice(data.lower)} – {formatPrice(data.upper)}
          </p>
        )}
      </div>
    )
  }
  return null
}

export default function PriceChart({ forecast, height = 240 }: PriceChartProps) {
  const currentPrice = forecast.current_price

  // Build continuous time series
  const data: ChartDataPoint[] = [
    { name: 'Today', price: currentPrice, lower: currentPrice, upper: currentPrice, isForecast: false },
    ...forecast.forecasts.map(f => ({
      name: `Day ${f.days}`,
      price: f.predicted_price,
      lower: f.lower_bound,
      upper: f.upper_bound,
      isForecast: true,
    })),
  ]

  const allPrices = [
    currentPrice,
    ...forecast.forecasts.map(f => f.predicted_price),
    ...forecast.forecasts.map(f => f.lower_bound),
    ...forecast.forecasts.map(f => f.upper_bound),
  ]
  const minPrice = Math.floor((Math.min(...allPrices) - 50) / 50) * 50
  const maxPrice = Math.ceil((Math.max(...allPrices) + 50) / 50) * 50

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#1e293b' }}
          />

          <YAxis
            domain={[minPrice, maxPrice]}
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${v}`}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Current price benchmark line */}
          <ReferenceLine
            y={currentPrice}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeOpacity={0.7}
            label={{
              value: `Current ₹${currentPrice}`,
              fill: '#cbd5e1',
              fontSize: 10,
              position: 'insideTopRight',
            }}
          />

          <Area
            type="monotone"
            dataKey="price"
            name="Forecast Price"
            stroke="#22c55e"
            strokeWidth={2.5}
            fill="url(#priceGradient)"
            dot={{ fill: '#22c55e', r: 3.5, strokeWidth: 1.5, stroke: '#0f172a' }}
            activeDot={{ r: 5, fill: '#4ade80', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
