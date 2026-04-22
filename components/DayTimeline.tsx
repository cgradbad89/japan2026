'use client'

import { useState } from 'react'
import type { Activity, ActivityType, Day, MealAlternative } from '@/data/itinerary'

const typeColor: Record<ActivityType, string> = {
  sightseeing: '#C0392B',
  meal: '#B8860B',
  transport: '#9ca3af',
  entertainment: '#7c3aed',
  free: '#d1d5db',
  accommodation: '#d1d5db',
}

const typeEmoji: Record<ActivityType, string> = {
  transport: '🚅',
  sightseeing: '🏯',
  meal: '🍜',
  accommodation: '🏨',
  entertainment: '🎭',
  free: '☕',
}

function ActivityCard({ activity }: { activity: Activity }) {
  const [altsOpen, setAltsOpen] = useState(false)
  const [selectedAlt, setSelectedAlt] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const color = typeColor[activity.type]
  const hasAlternatives = activity.alternatives && activity.alternatives.length > 0

  return (
    <div
      className="flex-1 rounded-lg p-2 bg-white"
      style={{
        borderLeft: `2px solid ${color}`,
        border: '0.5px solid #e5e7eb',
        borderLeftWidth: '2px',
        borderLeftColor: color,
        backgroundColor: activity.isTBD ? '#fffaf0' : '#ffffff',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <span className="text-[11px] leading-none mt-[1px]">{typeEmoji[activity.type]}</span>
          <h3 className="font-bold text-[11px] leading-snug text-[#1a1a1a]">
            {activity.title}
            {activity.isTBD && (
              <span className="ml-1.5 inline-block px-1 py-[1px] text-[8px] font-semibold rounded bg-yellow-200 text-yellow-900 align-middle">
                TBD
              </span>
            )}
          </h3>
        </div>
        <button
          onClick={() => setChecked(!checked)}
          className="flex-shrink-0 w-[15px] h-[15px] rounded-full border border-[#d1d5db] flex items-center justify-center"
          aria-label="mark done"
        >
          {checked && (
            <span className="block w-[8px] h-[8px] rounded-full" style={{ background: color }} />
          )}
        </button>
      </div>

      {activity.description && (
        <p className="text-[10px] text-[#6b7280] mt-1 leading-snug">{activity.description}</p>
      )}

      {activity.address && (
        <p className="text-[9px] text-[#6b7280] mt-1 leading-snug">📍 {activity.address}</p>
      )}

      {activity.highlight && (
        <div
          className="mt-1.5 px-2 py-1 text-[10px] italic text-[#1a1a1a] leading-snug"
          style={{ borderLeft: '2px solid #fca5a5', backgroundColor: '#fff8f8' }}
        >
          {activity.highlight}
        </div>
      )}

      {activity.note && (
        <div
          className="mt-1.5 px-2 py-1 text-[9px] text-[#6b7280] leading-snug"
          style={{ borderLeft: '2px solid #d1d5db', backgroundColor: '#f9fafb' }}
        >
          💡 {activity.note}
        </div>
      )}

      {hasAlternatives && (
        <div className="mt-2">
          <button
            onClick={() => setAltsOpen(!altsOpen)}
            className="text-[10px] font-medium text-[#B8860B] hover:text-[#8a6400]"
          >
            {activity.alternatives!.length} alternatives · swap {altsOpen ? '▴' : '▾'}
          </button>

          {altsOpen && (
            <div className="mt-1.5 space-y-1 bg-[#fafaf8] rounded p-1.5 border border-[#e5e7eb]">
              {activity.alternatives!.map((alt: MealAlternative) => (
                <button
                  key={alt.id}
                  onClick={() => setSelectedAlt(selectedAlt === alt.id ? null : alt.id)}
                  className="w-full text-left flex items-start gap-1.5 p-1.5 rounded hover:bg-white transition-colors"
                  style={{
                    backgroundColor: selectedAlt === alt.id ? '#ffffff' : 'transparent',
                    border: selectedAlt === alt.id ? '1px solid #B8860B' : '1px solid transparent',
                  }}
                >
                  <span
                    className="flex-shrink-0 mt-[2px] w-[10px] h-[10px] rounded-full border"
                    style={{
                      borderColor: '#B8860B',
                      backgroundColor: selectedAlt === alt.id ? '#B8860B' : '#ffffff',
                    }}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] font-medium text-[#1a1a1a]">{alt.name}</span>
                    {alt.note && (
                      <span className="block text-[9px] text-[#6b7280] mt-[1px]">{alt.note}</span>
                    )}
                    {alt.address && (
                      <span className="block text-[9px] text-[#9ca3af] mt-[1px]">📍 {alt.address}</span>
                    )}
                  </span>
                </button>
              ))}
              <button className="w-full text-left text-[9px] text-[#9ca3af] hover:text-[#B8860B] p-1.5 italic">
                + Add alternative
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DayTimeline({ day }: { day: Day }) {
  const totalActs = day.activities.length

  const handleAskClaude = () => {
    if (typeof window !== 'undefined') {
      // Phase 3 placeholder
      console.log('Ask Claude — coming soon')
    }
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#C0392B] leading-none">
              D{day.dayNumber}
            </span>
          </div>
          <h2 className="text-base font-semibold text-[#1a1a1a] mt-1">{day.title}</h2>
          <p className="text-[11px] text-[#6b7280] mt-[2px]">
            {day.dayLabel} · {day.travelers}
          </p>
        </div>
        <button
          onClick={handleAskClaude}
          className="flex-shrink-0 text-[11px] px-2.5 py-1.5 border border-[#C0392B] text-[#C0392B] rounded-md hover:bg-[#fff8f8] transition-colors font-medium"
        >
          ✦ Ask Claude
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-1">
          <span>0 of {totalActs} activities</span>
        </div>
        <div className="h-[3px] bg-[#fde8e8] rounded-full overflow-hidden">
          <div className="h-full bg-[#C0392B]" style={{ width: '0%' }} />
        </div>
      </div>

      <div className="relative">
        {day.activities.map((act, idx) => {
          const color = typeColor[act.type]
          const isLast = idx === day.activities.length - 1
          return (
            <div key={act.id} className="flex gap-2 items-stretch">
              <div className="flex-shrink-0 w-10 pt-2 text-[9px] text-[#9ca3af] leading-tight">
                {act.time || ''}
              </div>

              <div className="flex-shrink-0 w-4 flex flex-col items-center">
                <div
                  className="w-3 h-3 rounded-full bg-white mt-2 flex-shrink-0"
                  style={{ border: `2px solid ${color}` }}
                />
                {!isLast && <div className="flex-1 w-px bg-[#fde8e8] mt-1 mb-1" />}
              </div>

              <div className="flex-1 min-w-0 pb-3">
                <ActivityCard activity={act} />
              </div>
            </div>
          )
        })}
      </div>

      {day.ideas && day.ideas.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
          <h3 className="text-xs font-semibold text-[#1a1a1a] mb-2">
            💡 Ideas for this day
          </h3>
          <p className="text-[10px] text-[#9ca3af] mb-2 italic">Optional — not in the plan</p>
          <div className="space-y-1.5">
            {day.ideas.map((idea, i) => (
              <div
                key={i}
                className="text-[10px] italic text-[#6b7280] bg-[#fafaf8] border border-[#e5e7eb] rounded px-2 py-1.5"
              >
                {idea}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
