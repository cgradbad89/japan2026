'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import HubBanner from '@/components/HubBanner'
import DayTimeline from '@/components/DayTimeline'
import StaysPage from '@/components/StaysPage'
import type { Activity, Day, Leg } from '@/data/itinerary'
import { subscribeToDay } from '@/lib/firestore'

type Tab = 'itinerary' | 'stays'

export default function LegView({ leg }: { leg: Leg }) {
  const [tab, setTab] = useState<Tab>('itinerary')
  const [activeDayId, setActiveDayId] = useState(leg.days[0]?.id)
  const [editMode, setEditMode] = useState(false)
  const [dayOverrides, setDayOverrides] = useState<
    Record<string, { activities: Activity[] | null; ideas: string[] | null }>
  >({})

  useEffect(() => {
    const unsubs = leg.days.map((d) =>
      subscribeToDay(d.id, (data) => {
        setDayOverrides((prev) => ({
          ...prev,
          [d.id]: { activities: data.activities, ideas: data.ideas },
        }))
      })
    )
    return () => {
      unsubs.forEach((u) => u())
    }
  }, [leg.days])

  const mergedDays: Day[] = leg.days.map((d) => {
    const o = dayOverrides[d.id]
    const activities = o?.activities ?? d.activities
    const ideas = o?.ideas ?? d.ideas ?? []
    return { ...d, activities, ideas }
  })

  const activeDay =
    mergedDays.find((d) => d.id === activeDayId) ?? mergedDays[0]

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <HubBanner />

      <header className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-[11px] text-[#6b7280] hover:text-[#1a1a1a]">
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
            style={{ color: tab === 'itinerary' ? '#C0392B' : '#6b7280' }}
          >
            Itinerary
            {tab === 'itinerary' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C0392B]" />
            )}
          </button>
          <button
            onClick={() => setTab('stays')}
            className="relative py-2.5 text-xs font-medium transition-colors"
            style={{ color: tab === 'stays' ? '#C0392B' : '#6b7280' }}
          >
            Stays
            {tab === 'stays' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C0392B]" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto pb-24">
        {tab === 'itinerary' && (
          <>
            <div className="bg-white border-b border-[#e5e7eb] overflow-x-auto no-scrollbar">
              <div className="flex gap-2 py-3 min-w-max" style={{ paddingLeft: 16, paddingRight: 16 }}>
                {mergedDays.map((d) => {
                  const isActive = d.id === activeDay?.id
                  const [, mm, dd] = d.date.split('-')
                  const label = `${parseInt(mm, 10)}/${parseInt(dd, 10)}`
                  return (
                    <button
                      key={d.id}
                      onClick={() => setActiveDayId(d.id)}
                      className="flex-shrink-0 px-4 rounded-full text-[12px] font-semibold transition-colors"
                      style={{
                        backgroundColor: isActive ? '#C0392B' : '#f3f4f6',
                        color: isActive ? '#ffffff' : '#6b7280',
                        minHeight: 36,
                        minWidth: 52,
                      }}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {activeDay && <DayTimeline day={activeDay} editMode={editMode} />}
          </>
        )}

        {tab === 'stays' && (
          <StaysPage
            accommodations={leg.accommodations}
            leg={leg.id}
            editMode={editMode}
          />
        )}
      </main>

      <button
        onClick={() => setEditMode(!editMode)}
        className="fixed bottom-5 right-5 shadow-lg rounded-full font-semibold transition-colors"
        style={{
          zIndex: 9999,
          backgroundColor: editMode ? '#16a34a' : '#C0392B',
          color: '#ffffff',
          minWidth: editMode ? 92 : 52,
          minHeight: 52,
          padding: editMode ? '10px 20px' : '10px 16px',
          fontSize: editMode ? '13px' : '18px',
        }}
        aria-label={editMode ? 'Exit edit mode' : 'Enter edit mode'}
      >
        {editMode ? 'Done ✓' : '✎'}
      </button>
    </div>
  )
}
