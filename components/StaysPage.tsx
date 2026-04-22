'use client'

import type { Accommodation } from '@/data/itinerary'

const typeColor: Record<Accommodation['type'], string> = {
  hotel: '#C0392B',
  rental: '#B8860B',
  ryokan: '#7c3aed',
}

const typeIcon: Record<Accommodation['type'], string> = {
  hotel: '🏨',
  rental: '🏠',
  ryokan: '🏯',
}

const typeLabel: Record<Accommodation['type'], string> = {
  hotel: 'Hotel',
  rental: 'Rental',
  ryokan: 'Ryokan',
}

function StayCard({ stay }: { stay: Accommodation }) {
  const color = typeColor[stay.type]
  return (
    <div
      className="bg-white rounded-lg overflow-hidden mb-3"
      style={{ border: '0.5px solid #e5e7eb', opacity: stay.isTBD ? 0.95 : 1 }}
    >
      <div style={{ height: '3px', background: color }} />

      <div className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-lg leading-none mt-[1px]">{typeIcon[stay.type]}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-[#1a1a1a] leading-snug">{stay.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className="inline-block px-1.5 py-[2px] rounded text-[9px] font-semibold"
                style={{ backgroundColor: `${color}15`, color: color }}
              >
                {typeLabel[stay.type]}
              </span>
              {stay.isTBD && (
                <span className="inline-block px-1.5 py-[2px] rounded text-[9px] font-semibold bg-yellow-100 text-yellow-800">
                  TBD — tap to update
                </span>
              )}
            </div>
          </div>
          <button className="text-[#9ca3af] hover:text-[#6b7280] p-1" aria-label="edit">
            ✎
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#1a1a1a] mb-2">
          <span>{stay.checkIn}</span>
          <span className="text-[#9ca3af]">→</span>
          <span>{stay.checkOut}</span>
          <span
            className="inline-block px-1.5 py-[2px] rounded text-[9px] font-semibold ml-auto"
            style={{ backgroundColor: '#fafaf8', color: '#6b7280' }}
          >
            {stay.nights} {stay.nights === 1 ? 'night' : 'nights'}
          </span>
        </div>

        <p className="text-[10px] text-[#6b7280] mb-2 flex items-start gap-1">
          <span>📍</span>
          <span>{stay.address}</span>
        </p>

        <div className="mb-2">
          {stay.bookingUrl ? (
            <a
              href={stay.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-green-700 hover:underline font-medium"
            >
              🔗 View booking
            </a>
          ) : (
            <span className="text-[10px] text-[#9ca3af] italic">Add booking link</span>
          )}
        </div>

        {stay.notes ? (
          <div className="bg-amber-50 border border-amber-200 rounded px-2 py-1.5 text-[10px] text-[#78350f]">
            🔑 {stay.notes}
          </div>
        ) : (
          <div className="text-[10px] text-[#9ca3af] italic">Add check-in notes</div>
        )}
      </div>
    </div>
  )
}

export default function StaysPage({
  accommodations,
}: {
  accommodations: Accommodation[]
  leg: string
}) {
  const sorted = [...accommodations].sort((a, b) => a.id.localeCompare(b.id))
  const totalProperties = sorted.length
  const totalNights = sorted.reduce((s, a) => s + a.nights, 0)
  const cities = new Set(
    sorted.map((a) => {
      const parts = a.address.split(',').map((p) => p.trim())
      return parts[parts.length - 2] || parts[0] || ''
    })
  ).size

  return (
    <div className="px-4 py-4">
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <div className="flex-shrink-0 bg-white border border-[#e5e7eb] rounded-full px-3 py-1.5 text-[10px]">
          <span className="font-semibold text-[#1a1a1a]">{totalProperties}</span>
          <span className="text-[#6b7280] ml-1">properties</span>
        </div>
        <div className="flex-shrink-0 bg-white border border-[#e5e7eb] rounded-full px-3 py-1.5 text-[10px]">
          <span className="font-semibold text-[#1a1a1a]">{totalNights}</span>
          <span className="text-[#6b7280] ml-1">nights</span>
        </div>
        <div className="flex-shrink-0 bg-white border border-[#e5e7eb] rounded-full px-3 py-1.5 text-[10px]">
          <span className="font-semibold text-[#1a1a1a]">{cities}</span>
          <span className="text-[#6b7280] ml-1">{cities === 1 ? 'city' : 'cities'}</span>
        </div>
      </div>

      {sorted.map((stay) => (
        <StayCard key={stay.id} stay={stay} />
      ))}
    </div>
  )
}
