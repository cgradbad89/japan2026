'use client'

import Link from 'next/link'
import { useState } from 'react'
import HubBanner from '@/components/HubBanner'
import DayTimeline from '@/components/DayTimeline'
import StaysPage from '@/components/StaysPage'
import type { Leg } from '@/data/itinerary'

type Tab = 'itinerary' | 'stays'

export default function LegView({ leg }: { leg: Leg }) {
  const [tab, setTab] = useState<Tab>('itinerary')
  const [activeDayId, setActiveDayId] = useState(leg.days[0]?.id)
  const activeDay = leg.days.find((d) => d.id === activeDayId) ?? leg.days[0]

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <HubBanner />

      <header className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="text-[11px] text-[#6b7280] hover:text-[#1a1a1a]"
          >
            ← Home
          </Link>
          <h1 className="text-2xl font-bold text-[#1a1a1a] mt-2">{leg.title}</h1>
          <p className="text-[11px] text-[#6b7280] mt-0.5">
            {leg.dateRange} · {leg.travelers}
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 flex gap-6 border-t border-[#f3f4f6]">
          <button
            onClick={() => setTab('itinerary')}
            className="relative py-2.5 text-xs font-medium transition-colors"
            style={{
              color: tab === 'itinerary' ? '#C0392B' : '#6b7280',
            }}
          >
            Itinerary
            {tab === 'itinerary' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C0392B]" />
            )}
          </button>
          <button
            onClick={() => setTab('stays')}
            className="relative py-2.5 text-xs font-medium transition-colors"
            style={{
              color: tab === 'stays' ? '#C0392B' : '#6b7280',
            }}
          >
            Stays
            {tab === 'stays' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C0392B]" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {tab === 'itinerary' && (
          <>
            <div className="bg-white border-b border-[#e5e7eb] overflow-x-auto">
              <div className="flex gap-2 px-4 py-3 min-w-max">
                {leg.days.map((d) => {
                  const isActive = d.id === activeDay?.id
                  return (
                    <button
                      key={d.id}
                      onClick={() => setActiveDayId(d.id)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
                      style={{
                        backgroundColor: isActive ? '#C0392B' : '#f3f4f6',
                        color: isActive ? '#ffffff' : '#6b7280',
                      }}
                    >
                      D{d.dayNumber}
                    </button>
                  )
                })}
              </div>
            </div>

            {activeDay && <DayTimeline day={activeDay} />}
          </>
        )}

        {tab === 'stays' && (
          <StaysPage accommodations={leg.accommodations} leg={leg.id} />
        )}
      </main>
    </div>
  )
}
