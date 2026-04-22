'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import HubBanner from '@/components/HubBanner'
import {
  seedChecklistIfEmpty,
  subscribeToChecklist,
  toggleChecklistItem,
  type ChecklistItem,
} from '@/lib/firestore'

const SEED_ITEMS: { id: string; label: string; order: number }[] = [
  {
    id: 'item-1',
    order: 1,
    label: 'Shinkansen: Book Green Car seats for all inter-city travel (April 1)',
  },
  {
    id: 'item-2',
    order: 2,
    label: 'Luggage: Arrange Takkyubin delivery Shinagawa → Kyoto → Omori',
  },
  {
    id: 'item-3',
    order: 3,
    label: 'Sumo Tickets: Purchase for May Grand Tournament (early April release)',
  },
  {
    id: 'item-4',
    order: 4,
    label: 'TeamLab: Book time slot tickets for Botanical Garden Osaka',
  },
  {
    id: 'item-5',
    order: 5,
    label: 'Pocket Wifi / E-SIM: Arrange for all 5 family members',
  },
  {
    id: 'item-6',
    order: 6,
    label: 'Fushimi Canal Boat Tour: Book in advance (kyoto-fushimi.or.jp)',
  },
  {
    id: 'item-7',
    order: 7,
    label: 'Kobe Beef Mouriya Gion: Make reservation',
  },
  {
    id: 'item-8',
    order: 8,
    label: 'Tea Ceremony Shinjuku: Book via mai-ko.com',
  },
  {
    id: 'item-9',
    order: 9,
    label: 'Sumo lunch (Day 10): Confirm reservation at Dosukoi Tanaka',
  },
  {
    id: 'item-10',
    order: 10,
    label: 'Hiroshima Shinkansen: Train 166 Car 110 Seats 7A-D confirmed',
  },
]

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [seeded, setSeeded] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await seedChecklistIfEmpty(SEED_ITEMS)
      } catch (e) {
        console.error('seed error', e)
      } finally {
        if (!cancelled) setSeeded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!seeded) return
    const unsub = subscribeToChecklist(setItems)
    return unsub
  }, [seeded])

  const total = items.length
  const done = items.filter((i) => i.done).length
  const pct = total > 0 ? (done / total) * 100 : 0

  const handleToggle = async (item: ChecklistItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i))
    )
    try {
      await toggleChecklistItem(item.id, item.done)
    } catch {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, done: item.done } : i))
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <HubBanner />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-12">
        <Link href="/" className="text-[11px] text-[#6b7280] hover:text-[#1a1a1a]">
          ← Home
        </Link>

        <header className="mt-3 mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
            📋 Pre-Trip Checklist
          </h1>
          <p className="text-[12px] text-[#6b7280] mt-1">Golden Week · May 2026</p>
        </header>

        <div className="mb-5">
          <div className="flex items-center justify-between text-[11px] text-[#6b7280] mb-1.5">
            <span>
              {done} of {total || 10} items ready
            </span>
            {total > 0 && <span>{Math.round(pct)}%</span>}
          </div>
          <div className="h-[4px] bg-[#fde8e8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C0392B] transition-all duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {!seeded && items.length === 0 && (
            <p className="text-[11px] text-[#9ca3af] italic py-6 text-center">
              Loading checklist…
            </p>
          )}
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleToggle(item)}
              className="w-full text-left bg-white rounded-lg flex items-start gap-3 transition-colors hover:bg-[#fafaf8]"
              style={{
                border: '0.5px solid #e5e7eb',
                padding: '12px 14px',
                minHeight: 56,
              }}
            >
              <span
                className="flex-shrink-0 mt-[1px] flex items-center justify-center rounded-full"
                style={{
                  width: 22,
                  height: 22,
                  border: `1.5px solid ${item.done ? '#16a34a' : '#C0392B'}`,
                  backgroundColor: item.done ? '#16a34a' : 'transparent',
                }}
              >
                {item.done && (
                  <svg
                    viewBox="0 0 12 12"
                    width="11"
                    height="11"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 6l2.5 2.5L10 3" />
                  </svg>
                )}
              </span>
              <span
                className="flex-1 text-[12px] leading-snug"
                style={{
                  color: item.done ? '#9ca3af' : '#1a1a1a',
                  textDecoration: item.done ? 'line-through' : 'none',
                }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
