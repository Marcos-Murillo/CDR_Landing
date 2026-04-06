'use client'

interface SparklineProps {
  data: number[]
  color: string
  up: boolean
  width?: number
  height?: number
}

export function SparklineChart({ data, color, width = 64, height = 32 }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const pad = 2
  const w = width - pad * 2
  const h = height - pad * 2

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w
    const y = pad + h - ((v - min) / range) * h
    return `${x},${y}`
  })

  const pathD = `M ${points.join(' L ')}`

  // Area fill path
  const first = points[0].split(',')
  const last = points[points.length - 1].split(',')
  const areaD = `M ${points.join(' L ')} L ${last[0]},${pad + h} L ${first[0]},${pad + h} Z`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <defs>
        <linearGradient id={`spark-grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#spark-grad-${color.replace('#','')})`} />
      <path d={pathD} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
