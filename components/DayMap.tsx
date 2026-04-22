'use client'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import type { Accommodation, Activity, ActivityType, Day, MealAlternative } from '@/data/itinerary'
import { googleMapsUrl } from '@/lib/maps'

// Fix default Leaflet marker paths under webpack/Next
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const MONTH_MAP: Record<string, number> = {
  Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11,
}

function parseAccDate(str: string): string {
  const [mon, d] = str.trim().split(' ')
  const month = String((MONTH_MAP[mon] ?? 0) + 1).padStart(2, '0')
  const day = String(d).padStart(2, '0')
  return `2026-${month}-${day}`
}

const STAY_COORDS: Record<string, { lat: number; lng: number }> = {
  'gw-stay-1': { lat: 35.6284, lng: 139.7387 },
  'gw-stay-2': { lat: 34.9977, lng: 135.7590 },
  'gw-stay-3': { lat: 35.5793, lng: 139.7348 },
  'hk-stay-1': { lat: 43.0686, lng: 141.3508 },
  'hk-stay-2': { lat: 42.4808, lng: 141.0183 },
  'hk-stay-3': { lat: 43.0602, lng: 141.3527 },
}

const typePinColor: Record<ActivityType, string> = {
  sightseeing: '#C0392B',
  meal: '#B8860B',
  transport: '#6b7280',
  entertainment: '#7c3aed',
  free: '#9ca3af',
  accommodation: '#9ca3af',
}

const typeEmoji: Record<ActivityType, string> = {
  transport: '🚅',
  sightseeing: '🏯',
  meal: '🍜',
  accommodation: '🏨',
  entertainment: '🎭',
  free: '☕',
}

const typeLabel: Record<ActivityType, string> = {
  transport: 'Transport',
  sightseeing: 'Sightseeing',
  meal: 'Meal',
  accommodation: 'Stay',
  entertainment: 'Entertainment',
  free: 'Free',
}

function makeNumberedIcon(num: number, color: string, checked: boolean) {
  const check = checked
    ? `<div style="position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#16a34a;display:flex;align-items:center;justify-content:center;border:1.5px solid white;">
         <svg viewBox="0 0 12 12" width="8" height="8" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6l2.5 2.5L10 3"/></svg>
       </div>`
    : ''
  return L.divIcon({
    html: `<div style="position:relative;width:32px;height:32px;">
      <div style="width:32px;height:32px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:13px;opacity:${checked ? 0.7 : 1};">${num}</div>
      ${check}
    </div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

function makeAltIcon() {
  return L.divIcon({
    html: `<div style="width:24px;height:24px;border-radius:50%;background:white;border:2px solid #B8860B;opacity:0.65;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

function makeAccommodationIcon() {
  return L.divIcon({
    html: `<div style="width:34px;height:34px;border-radius:50%;background:#7c3aed;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.3);">🏨</div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length === 0) return
    if (positions.length === 1) {
      map.setView(positions[0], 14)
      return
    }
    map.fitBounds(positions, { padding: [40, 40] })
  }, [positions, map])
  return null
}

type Sheet =
  | { kind: 'activity'; activity: Activity; order: number }
  | { kind: 'alt'; parent: Activity; alt: MealAlternative }
  | null

export default function DayMap({
  day,
  checkoffs,
  mealSelections,
  onToggleCheckoff,
  onSelectAlt,
  accommodations,
}: {
  day: Day
  checkoffs: Record<string, boolean>
  mealSelections: Record<string, string>
  onToggleCheckoff: (id: string, current: boolean) => void
  onSelectAlt: (activityId: string, altId: string) => void
  accommodations: Accommodation[]
}) {
  const [sheet, setSheet] = useState<Sheet>(null)

  // Activities that get numbered pins (excludes free and accommodation)
  const numberedPins = day.activities.filter(
    (a) =>
      a.lat !== undefined &&
      a.lng !== undefined &&
      a.type !== 'free' &&
      a.type !== 'accommodation'
  )

  const accommodationActivities = day.activities.filter(
    (a) =>
      a.lat !== undefined &&
      a.lng !== undefined &&
      a.type === 'accommodation'
  )

  const altEntries: { parent: Activity; alt: MealAlternative }[] = []
  day.activities.forEach((a) => {
    if (a.type !== 'meal' || !a.alternatives) return
    a.alternatives.forEach((alt) => {
      if (alt.lat !== undefined && alt.lng !== undefined) {
        altEntries.push({ parent: a, alt })
      }
    })
  })

  const dayStr = day.date
  const dayAccommodations = accommodations.filter((acc) => {
    if (!(acc.id in STAY_COORDS)) return false
    const checkInStr = parseAccDate(acc.checkIn)
    const checkOutStr = parseAccDate(acc.checkOut)
    return dayStr >= checkInStr && dayStr < checkOutStr
  })

  if (
    numberedPins.length === 0 &&
    altEntries.length === 0 &&
    accommodationActivities.length === 0 &&
    dayAccommodations.length === 0
  ) {
    return (
      <div
        className="flex items-center justify-center text-[11px] text-[#9ca3af]"
        style={{ height: 'calc(100vh - 280px)', minHeight: 400 }}
      >
        No map data for this day
      </div>
    )
  }

  // Build polyline: numbered-pin positions, with accommodation coords prepended/appended
  const basePositions: [number, number][] = numberedPins.map((a) => [a.lat!, a.lng!])
  const prependCoords: [number, number][] = []
  const appendCoords: [number, number][] = []
  for (const acc of dayAccommodations) {
    const coords = STAY_COORDS[acc.id]
    const checkInStr = parseAccDate(acc.checkIn)
    const checkOutStr = parseAccDate(acc.checkOut)
    if (dayStr === checkInStr) {
      appendCoords.push([coords.lat, coords.lng])
    } else if (dayStr === checkOutStr) {
      prependCoords.push([coords.lat, coords.lng])
    }
    // mid-stay: not added to route line
  }
  const polylinePositions: [number, number][] = [...prependCoords, ...basePositions, ...appendCoords]

  const allPositions: [number, number][] = [
    ...polylinePositions,
    ...altEntries.map((e) => [e.alt.lat!, e.alt.lng!] as [number, number]),
    ...accommodationActivities.map((a) => [a.lat!, a.lng!] as [number, number]),
  ]
  const center = allPositions[0] ?? ([35.6762, 139.6503] as [number, number])

  const stripActivities = day.activities.filter(
    (a) => a.lat !== undefined && a.lng !== undefined && a.type !== 'free'
  )

  const showStrip = stripActivities.length > 0 || dayAccommodations.length > 0

  return (
    <div
      className="relative"
      style={{ height: 'calc(100vh - 280px)', minHeight: 400 }}
    >
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          subdomains='abcd'
          maxZoom={19}
        />
        <FitBounds positions={allPositions} />

        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{ color: '#C0392B', weight: 2, dashArray: '6 4', opacity: 0.7 }}
          />
        )}

        {altEntries.map(({ parent, alt }) => (
          <Marker
            key={alt.id}
            position={[alt.lat!, alt.lng!]}
            icon={makeAltIcon()}
            zIndexOffset={-100}
            eventHandlers={{ click: () => setSheet({ kind: 'alt', parent, alt }) }}
          />
        ))}

        {accommodationActivities.map((act) => (
          <Marker
            key={act.id}
            position={[act.lat!, act.lng!]}
            icon={makeAccommodationIcon()}
            zIndexOffset={500}
            eventHandlers={{
              click: () => setSheet({ kind: 'activity', activity: act, order: 0 }),
            }}
          />
        ))}

        {dayAccommodations.map((acc) => {
          const coords = STAY_COORDS[acc.id]
          const syntheticActivity: Activity = {
            id: acc.id,
            title: acc.name,
            type: 'accommodation',
            address: acc.address,
            highlight: acc.notes || undefined,
            note: `${acc.checkIn} → ${acc.checkOut} · ${acc.nights} nights`,
          }
          return (
            <Marker
              key={acc.id}
              position={[coords.lat, coords.lng]}
              icon={makeAccommodationIcon()}
              zIndexOffset={500}
              eventHandlers={{
                click: () => setSheet({ kind: 'activity', activity: syntheticActivity, order: 0 }),
              }}
            />
          )
        })}

        {numberedPins.map((act, i) => {
          const checked = !!checkoffs[act.id]
          const color = typePinColor[act.type]
          return (
            <Marker
              key={act.id}
              position={[act.lat!, act.lng!]}
              icon={makeNumberedIcon(i + 1, color, checked)}
              zIndexOffset={checked ? 0 : 1000}
              eventHandlers={{
                click: () => setSheet({ kind: 'activity', activity: act, order: i + 1 }),
              }}
            />
          )
        })}
      </MapContainer>

      {showStrip && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 500,
            padding: '16px 12px 8px',
            background: 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        >
          <div
            className="flex gap-1.5 overflow-x-auto"
            style={{ scrollbarWidth: 'none', pointerEvents: 'auto' } as React.CSSProperties}
          >
            {dayAccommodations.map((acc) => {
              const syntheticActivity: Activity = {
                id: acc.id,
                title: acc.name,
                type: 'accommodation',
                address: acc.address,
                highlight: acc.notes || undefined,
                note: `${acc.checkIn} → ${acc.checkOut} · ${acc.nights} nights`,
              }
              return (
                <button
                  key={acc.id}
                  onClick={() => setSheet({ kind: 'activity', activity: syntheticActivity, order: 0 })}
                  className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-bold whitespace-nowrap"
                  style={{ background: '#7c3aed', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                >
                  <span>🏨</span>
                  <span className="text-[9px] font-normal opacity-90 max-w-[70px] truncate">
                    {acc.name}
                  </span>
                </button>
              )
            })}
            {stripActivities.map((act) => {
              const isAccom = act.type === 'accommodation'
              const routeIdx = numberedPins.indexOf(act)
              const chipColor = isAccom ? '#7c3aed' : typePinColor[act.type]
              return (
                <button
                  key={act.id}
                  onClick={() =>
                    setSheet({
                      kind: 'activity',
                      activity: act,
                      order: isAccom ? 0 : routeIdx + 1,
                    })
                  }
                  className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-bold whitespace-nowrap"
                  style={{ background: chipColor, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                >
                  <span>{isAccom ? '🏨' : routeIdx + 1}</span>
                  <span className="text-[9px] font-normal opacity-90 max-w-[70px] truncate">
                    {act.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {sheet?.kind === 'activity' && (
        <ActivitySheet
          activity={sheet.activity}
          order={sheet.order}
          checked={!!checkoffs[sheet.activity.id]}
          mealSelections={mealSelections}
          onClose={() => setSheet(null)}
          onToggleCheckoff={onToggleCheckoff}
          onSelectAlt={onSelectAlt}
        />
      )}

      {sheet?.kind === 'alt' && (
        <AltSheet
          parent={sheet.parent}
          alt={sheet.alt}
          onClose={() => setSheet(null)}
          onSelect={() => {
            onSelectAlt(sheet.parent.id, sheet.alt.id)
            setSheet(null)
          }}
        />
      )}
    </div>
  )
}

const sheetStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  maxHeight: '70vh',
  overflowY: 'auto',
  background: 'white',
  borderRadius: '16px 16px 0 0',
  borderTop: '0.5px solid #e5e7eb',
  padding: 14,
  paddingBottom: 'calc(14px + env(safe-area-inset-bottom))',
  boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
}

const handleStyle: React.CSSProperties = {
  width: 36,
  height: 4,
  background: '#e5e7eb',
  borderRadius: 2,
  touchAction: 'pan-y',
}

function ActivitySheet({
  activity,
  order,
  checked,
  mealSelections,
  onClose,
  onToggleCheckoff,
  onSelectAlt,
}: {
  activity: Activity
  order: number
  checked: boolean
  mealSelections: Record<string, string>
  onClose: () => void
  onToggleCheckoff: (id: string, current: boolean) => void
  onSelectAlt: (activityId: string, altId: string) => void
}) {
  const color = typePinColor[activity.type]
  const selectedAltId = mealSelections[activity.id]
  return (
    <div style={sheetStyle}>
      <div className="flex justify-center mb-2">
        <div style={handleStyle} />
      </div>
      <button
        onClick={onClose}
        className="absolute top-1 right-1 rounded-full flex items-center justify-center text-[#6b7280] hover:bg-[#f3f4f6]"
        style={{ width: 44, height: 44, fontSize: 22 }}
        aria-label="close"
      >
        ×
      </button>

      <div className="flex items-start gap-2 mb-2 pr-6">
        <span className="text-base leading-none mt-[2px]">{typeEmoji[activity.type]}</span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#1a1a1a] leading-snug">
            {activity.type !== 'accommodation' && (
              <span className="text-[#C0392B] mr-1">#{order}</span>
            )}
            {activity.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {activity.time && (
              <span
                className="inline-block px-1.5 py-[2px] rounded text-[9px] font-semibold"
                style={{ backgroundColor: '#fafaf8', color: '#6b7280' }}
              >
                {activity.time}
              </span>
            )}
            <span
              className="inline-block px-1.5 py-[2px] rounded text-[9px] font-semibold"
              style={{ backgroundColor: `${color}15`, color }}
            >
              {typeLabel[activity.type]}
            </span>
          </div>
        </div>
      </div>

      {activity.description && (
        <p className="text-[11px] text-[#6b7280] mb-2 leading-snug">{activity.description}</p>
      )}

      {activity.address && (
        <p className="text-[10px] mb-2 leading-snug">
          <a
            href={googleMapsUrl(activity.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#6b7280] underline decoration-dotted underline-offset-2 hover:text-[#C0392B]"
          >
            📍 {activity.address}
          </a>
        </p>
      )}

      {activity.highlight && (
        <div
          className="mb-2 px-2 py-1.5 text-[11px] italic text-[#1a1a1a] leading-snug"
          style={{ borderLeft: '2px solid #fca5a5', backgroundColor: '#fff8f8' }}
        >
          {activity.highlight}
        </div>
      )}

      {activity.note && (
        <div
          className="mb-2 px-2 py-1.5 text-[10px] text-[#6b7280] leading-snug"
          style={{ borderLeft: '2px solid #d1d5db', backgroundColor: '#f9fafb' }}
        >
          💡 {activity.note}
        </div>
      )}

      {activity.type === 'meal' && activity.alternatives && activity.alternatives.length > 0 && (
        <div className="mb-3 bg-[#fafaf8] rounded p-2 border border-[#e5e7eb]">
          <p className="text-[10px] font-semibold text-[#6b7280] mb-1.5">Alternatives</p>
          <div className="space-y-1">
            {(() => {
              const originalSel = !selectedAltId || selectedAltId === activity.id
              return (
                <button
                  key="__original__"
                  onClick={() => onSelectAlt(activity.id, activity.id)}
                  className="w-full text-left flex items-start gap-1.5 p-1.5 rounded transition-colors"
                  style={{
                    backgroundColor: originalSel ? '#ffffff' : 'transparent',
                    border: originalSel ? '1px solid #B8860B' : '1px solid transparent',
                  }}
                >
                  <span
                    className="flex-shrink-0 mt-[2px] w-[10px] h-[10px] rounded-full border"
                    style={{
                      borderColor: '#B8860B',
                      backgroundColor: originalSel ? '#B8860B' : '#ffffff',
                    }}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[11px] font-medium text-[#1a1a1a]">
                      {activity.title}
                      <span className="ml-1 text-[10px] font-normal text-[#9ca3af]">
                        (original)
                      </span>
                    </span>
                    {activity.address && (
                      <span
                        className="block text-[10px] text-[#6b7280] mt-[1px] underline decoration-dotted underline-offset-2 hover:text-[#C0392B] cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); window.open(googleMapsUrl(activity.address!), '_blank', 'noopener,noreferrer') }}
                      >
                        📍 {activity.address}
                      </span>
                    )}
                  </span>
                </button>
              )
            })()}
            {activity.alternatives.map((alt) => {
              const isSel = selectedAltId === alt.id
              return (
                <button
                  key={alt.id}
                  onClick={() => onSelectAlt(activity.id, alt.id)}
                  className="w-full text-left flex items-start gap-1.5 p-1.5 rounded transition-colors"
                  style={{
                    backgroundColor: isSel ? '#ffffff' : 'transparent',
                    border: isSel ? '1px solid #B8860B' : '1px solid transparent',
                  }}
                >
                  <span
                    className="flex-shrink-0 mt-[2px] w-[10px] h-[10px] rounded-full border"
                    style={{
                      borderColor: '#B8860B',
                      backgroundColor: isSel ? '#B8860B' : '#ffffff',
                    }}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[11px] font-medium text-[#1a1a1a]">{alt.name}</span>
                    {alt.note && (
                      <span className="block text-[10px] text-[#6b7280] mt-[1px]">{alt.note}</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {activity.type !== 'accommodation' && (
        <button
          onClick={() => onToggleCheckoff(activity.id, checked)}
          className="w-full rounded-md py-2 text-[12px] font-semibold transition-colors"
          style={{
            backgroundColor: checked ? '#16a34a' : '#ffffff',
            color: checked ? '#ffffff' : '#16a34a',
            border: '1.5px solid #16a34a',
          }}
        >
          {checked ? 'Done ✓ — tap to undo' : 'Mark as done ✓'}
        </button>
      )}
    </div>
  )
}

function AltSheet({
  alt,
  onClose,
  onSelect,
}: {
  parent: Activity
  alt: MealAlternative
  onClose: () => void
  onSelect: () => void
}) {
  return (
    <div style={sheetStyle}>
      <div className="flex justify-center mb-2">
        <div style={handleStyle} />
      </div>
      <button
        onClick={onClose}
        className="absolute top-1 right-1 rounded-full flex items-center justify-center text-[#6b7280] hover:bg-[#f3f4f6]"
        style={{ width: 44, height: 44, fontSize: 22 }}
        aria-label="close"
      >
        ×
      </button>

      <div className="flex items-start gap-2 mb-2 pr-6">
        <span className="text-base leading-none mt-[2px]">🍜</span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#1a1a1a] leading-snug">{alt.name}</h3>
          <span
            className="inline-block mt-1 px-1.5 py-[2px] rounded text-[9px] font-semibold"
            style={{ backgroundColor: '#B8860B15', color: '#B8860B' }}
          >
            Alternative
          </span>
        </div>
      </div>

      {alt.note && <p className="text-[11px] text-[#6b7280] mb-2 leading-snug">{alt.note}</p>}
      {alt.address && (
        <p className="text-[10px] mb-3 leading-snug">
          <a
            href={googleMapsUrl(alt.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#6b7280] underline decoration-dotted underline-offset-2 hover:text-[#C0392B]"
          >
            📍 {alt.address}
          </a>
        </p>
      )}

      <button
        onClick={onSelect}
        className="w-full rounded-md py-2 text-[12px] font-semibold text-white"
        style={{ backgroundColor: '#B8860B' }}
      >
        Set as selected restaurant
      </button>
    </div>
  )
}
