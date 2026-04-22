'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import HubBanner from '@/components/HubBanner'

// May 1 2026 00:00 JST = April 30 2026 15:00 UTC
const TRIP_START_UTC = Date.UTC(2026, 3, 30, 15, 0, 0)

function diff(targetMs: number) {
  const now = Date.now()
  const ms = Math.max(0, targetMs - now)
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

function CountdownCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white rounded-lg border border-[#e5e7eb] px-3 py-4 flex flex-col items-center">
      <span
        className="font-bold text-[#C0392B] tabular-nums leading-none"
        style={{ fontSize: 'clamp(28px, 7vw, 36px)' }}
      >
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[11px] text-[#6b7280] mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

export default function Home() {
  const [time, setTime] = useState(() => diff(TRIP_START_UTC))

  useEffect(() => {
    const id = setInterval(() => setTime(diff(TRIP_START_UTC)), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <HubBanner />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <section className="mb-8 sm:mb-10 text-center">
          <h1
            className="font-bold text-[#1a1a1a] tracking-tight"
            style={{ fontSize: 'clamp(36px, 10vw, 60px)', lineHeight: 1.05 }}
          >
            Japan 2026
          </h1>
          <p className="text-[13px] sm:text-base text-[#1a1a1a] mt-3">
            Golden Week · May 1–10 · 5 Adults
          </p>
          <p className="text-[13px] sm:text-base text-[#6b7280] mt-1">
            Hokkaido · May 11–15 · John & Sabrina
          </p>
        </section>

        <section className="mb-8 sm:mb-10">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-lg mx-auto">
            <CountdownCard value={time.days} label="Days" />
            <CountdownCard value={time.hours} label="Hours" />
            <CountdownCard value={time.minutes} label="Minutes" />
            <CountdownCard value={time.seconds} label="Seconds" />
          </div>
        </section>

        <section className="space-y-3 max-w-xl mx-auto">
          <Link
            href="/itinerary/golden-week"
            className="block bg-white rounded-lg p-5 border border-[#e5e7eb] hover:shadow-md transition-shadow group"
            style={{ borderLeft: '3px solid #C0392B', minHeight: 72 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-[#1a1a1a]">Golden Week</h2>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  May 1–10 · Tokyo, Kyoto, Hiroshima, Osaka · 5 Adults
                </p>
              </div>
              <span className="text-[#C0392B] text-xl flex-shrink-0 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>

          <Link
            href="/itinerary/hokkaido"
            className="block bg-white rounded-lg p-5 border border-[#e5e7eb] hover:shadow-md transition-shadow group"
            style={{ borderLeft: '3px solid #C0392B', minHeight: 72 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-[#1a1a1a]">Hokkaido</h2>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  May 11–15 · Sapporo & Noboribetsu · John & Sabrina
                </p>
              </div>
              <span className="text-[#C0392B] text-xl flex-shrink-0 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>

          <Link
            href="/checklist"
            className="block bg-white rounded-lg px-4 py-3 border border-[#f3f4f6] hover:shadow-sm transition-shadow group"
            style={{ minHeight: 48 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[13px] font-semibold text-[#6b7280]">
                  📋 Pre-Trip Checklist
                </h3>
              </div>
              <span className="text-[#9ca3af] text-base flex-shrink-0 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        </section>
      </main>
    </div>
  )
}
