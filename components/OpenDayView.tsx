'use client'

import { useEffect, useState } from 'react'
import type { Activity, Day, KyotoOption } from '@/data/itinerary'
import { subscribeToKyotoSelections, toggleKyotoOption } from '@/lib/firestore'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-bold uppercase tracking-widest"
      style={{ color: '#9ca3af', marginBottom: 8 }}
    >
      {children}
    </p>
  )
}

function OptionCard({
  option,
  selected,
  onToggle,
}: {
  option: KyotoOption
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left flex items-start gap-3 rounded-xl transition-colors"
      style={{
        background: selected ? '#fff1f0' : '#ffffff',
        border: `1.5px solid ${selected ? '#C0392B' : '#e5e7eb'}`,
        padding: '12px 14px',
        marginBottom: 8,
      }}
    >
      <span style={{ fontSize: 22, lineHeight: 1, marginTop: 1, flexShrink: 0 }}>
        {option.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="font-semibold text-[13px]"
            style={{ color: '#1a1a1a' }}
          >
            {option.title}
          </span>
          {option.type === 'daytrip' && (
            <span
              className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ background: '#f3f4f6', color: '#6b7280' }}
            >
              Day Trip
            </span>
          )}
        </div>
        {option.duration && (
          <p className="text-[11px] mt-0.5" style={{ color: '#6b7280' }}>
            {option.duration}
          </p>
        )}
        {option.description && (
          <p className="text-[12px] mt-1 leading-snug" style={{ color: '#4b5563' }}>
            {option.description}
          </p>
        )}
        {option.highlight && (
          <p className="text-[11px] mt-1 leading-snug font-medium" style={{ color: '#C0392B' }}>
            ✦ {option.highlight}
          </p>
        )}
      </div>
      <div
        className="flex-shrink-0 rounded-full flex items-center justify-center"
        style={{
          width: 22,
          height: 22,
          border: `2px solid ${selected ? '#C0392B' : '#d1d5db'}`,
          background: selected ? '#C0392B' : 'transparent',
          marginTop: 2,
        }}
      >
        {selected && (
          <span style={{ color: '#fff', fontSize: 13, lineHeight: 1 }}>✓</span>
        )}
      </div>
    </button>
  )
}

function ConfirmedCard({ activity }: { activity: Activity }) {
  return (
    <div
      className="rounded-xl"
      style={{
        background: '#ffffff',
        border: '1.5px solid #e5e7eb',
        padding: '12px 14px',
        marginBottom: 8,
      }}
    >
      <div className="flex items-start gap-3">
        <span style={{ fontSize: 20, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>
          {activity.type === 'meal' ? '🍽' : activity.type === 'entertainment' ? '🎭' : '📍'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {activity.time && (
              <span className="text-[11px] font-medium" style={{ color: '#6b7280' }}>
                {activity.time}
              </span>
            )}
            <span className="font-semibold text-[13px]" style={{ color: '#1a1a1a' }}>
              {activity.title}
            </span>
            {activity.isTBD && (
              <span
                className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                style={{ background: '#f3f4f6', color: '#9ca3af' }}
              >
                TBD
              </span>
            )}
          </div>
          {activity.highlight && (
            <p className="text-[11px] mt-1 font-medium" style={{ color: '#C0392B' }}>
              ✦ {activity.highlight}
            </p>
          )}
          {activity.description && (
            <p className="text-[12px] mt-1 leading-snug" style={{ color: '#4b5563' }}>
              {activity.description}
            </p>
          )}
          {activity.note && (
            <p className="text-[11px] mt-1" style={{ color: '#6b7280' }}>
              {activity.note}
            </p>
          )}
          {activity.address && (
            <p className="text-[11px] mt-1" style={{ color: '#9ca3af' }}>
              📍 {activity.address}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OpenDayView({
  day,
  kyotoOptions,
}: {
  day: Day
  kyotoOptions: KyotoOption[]
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    const unsub = subscribeToKyotoSelections(day.id, (ids) => {
      setSelectedIds(ids)
    })
    return unsub
  }, [day.id])

  const handleToggle = async (option: KyotoOption) => {
    const isSelected = selectedIds.includes(option.id)
    // Optimistic update
    setSelectedIds((prev) =>
      isSelected ? prev.filter((id) => id !== option.id) : [...prev, option.id]
    )
    try {
      await toggleKyotoOption(day.id, option.id, isSelected)
    } catch {
      // Revert on error
      setSelectedIds((prev) =>
        isSelected ? [...prev, option.id] : prev.filter((id) => id !== option.id)
      )
    }
  }

  const kyotoLocal = kyotoOptions.filter((o) => o.type === 'kyoto')
  const dayTrips = kyotoOptions.filter((o) => o.type === 'daytrip')
  const selectedOptions = kyotoOptions.filter((o) => selectedIds.includes(o.id))

  return (
    <div style={{ padding: '16px 16px 32px' }}>
      {/* Day Summary Banner */}
      <div
        className="rounded-xl mb-4"
        style={{
          background: '#fff1f0',
          border: '1.5px solid #fecaca',
          padding: '12px 14px',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span style={{ fontSize: 16 }}>🗓</span>
          <span className="text-[12px] font-bold" style={{ color: '#C0392B' }}>
            Open Day
          </span>
        </div>
        {day.summary && (
          <p className="text-[12px] leading-snug" style={{ color: '#4b5563' }}>
            {day.summary}
          </p>
        )}
      </div>

      {/* Selected strip */}
      {selectedOptions.length > 0 && (
        <div className="mb-5">
          <SectionLabel>Interested In</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((o) => (
              <span
                key={o.id}
                className="inline-flex items-center gap-1 rounded-full text-[11px] font-medium px-3 py-1"
                style={{
                  background: '#fff1f0',
                  border: '1px solid #fecaca',
                  color: '#C0392B',
                }}
              >
                <span>{o.icon}</span>
                <span>{o.title}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Kyoto Options */}
      {kyotoLocal.length > 0 && (
        <div className="mb-5">
          <SectionLabel>Kyoto Options</SectionLabel>
          {kyotoLocal.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              selected={selectedIds.includes(option.id)}
              onToggle={() => handleToggle(option)}
            />
          ))}
        </div>
      )}

      {/* Day Trips */}
      {dayTrips.length > 0 && (
        <div className="mb-5">
          <SectionLabel>Day Trips from Kyoto</SectionLabel>
          {dayTrips.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              selected={selectedIds.includes(option.id)}
              onToggle={() => handleToggle(option)}
            />
          ))}
        </div>
      )}

      {/* Confirmed activities */}
      {day.activities.length > 0 && (
        <div>
          <SectionLabel>Confirmed Today</SectionLabel>
          {day.activities.map((activity) => (
            <ConfirmedCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}
