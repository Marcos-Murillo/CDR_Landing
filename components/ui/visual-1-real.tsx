'use client'

import * as React from "react"
import { SparklineChart } from '@/components/sparkline'

interface Visual1RealProps {
  mainColor?: string
  secondaryColor?: string
  gridColor?: string
  sparkData?: number[]
  genderData?: { hombres: number; mujeres: number }
  pct?: number | null
}

export function Visual1Real({
  mainColor = "#2563EB",
  secondaryColor = "#93c5fd",
  gridColor = "#80808015",
  sparkData,
  genderData,
  pct,
}: Visual1RealProps) {
  const up = pct !== null && pct !== undefined && pct > 0
  const down = pct !== null && pct !== undefined && pct < 0
  const sparkColor = up ? '#16a34a' : down ? '#dc2626' : mainColor

  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden rounded-t-lg"
      style={{ background: `linear-gradient(135deg, ${mainColor}18 0%, ${secondaryColor}10 100%)` }}
    >
      {/* Grid */}
      <div
        style={{ "--grid-color": gridColor } as React.CSSProperties}
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px] opacity-60"
      />

      {/* Sparkline real centrada */}
      {sparkData && sparkData.length > 1 && (
        <div className="absolute inset-0 z-[2] flex items-center justify-center px-4">
          <SparklineChart data={sparkData} color={sparkColor} up={up} width={280} height={70} />
        </div>
      )}

      {/* Badges género */}
      {genderData && (
        <div className="absolute top-3 right-3 z-[8] flex items-center gap-1.5">
          <div className="flex shrink-0 items-center rounded-full border border-zinc-200 bg-white/80 px-2 py-0.5 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: mainColor }} />
            <span className="ml-1 text-[10px] font-medium text-black">
              H: {genderData.hombres.toLocaleString('es-CO')}
            </span>
          </div>
          <div className="flex shrink-0 items-center rounded-full border border-zinc-200 bg-white/80 px-2 py-0.5 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: secondaryColor }} />
            <span className="ml-1 text-[10px] font-medium text-black">
              M: {genderData.mujeres.toLocaleString('es-CO')}
            </span>
          </div>
        </div>
      )}

      {/* Ellipse gradient */}
      <div className="absolute inset-0 z-[3] flex h-full w-full items-center justify-center pointer-events-none">
        <svg width="356" height="120" viewBox="0 0 356 120" fill="none">
          <rect width="356" height="120" fill="url(#v1r-paint)" />
          <defs>
            <radialGradient id="v1r-paint" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
              gradientTransform="translate(178 60) rotate(90) scale(60 178)">
              <stop stopColor={mainColor} stopOpacity="0.12" />
              <stop offset="1" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
