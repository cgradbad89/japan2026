'use client'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import type { Activity, ActivityType, Day, MealAlternative } from '@/data/itinerary'

// Fix default Leaflet marker paths under webpack/Next
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

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
}: {
  day: Day
  checkoffs: Record<string, boolean>
  mealSelections: Record<string, string>
  onToggleCheckoff: (id: string, current: boolean) => void
  onSelectAlt: (activityId: string, altId: string) => void
}) {
  const [sheet, setSheet] = useState<Sheet>(null)

  const routeActivities = day.activities.filter(
    (a) =>
      a.lat !== undefined &&
      a.lng !== undefined &&
      a.type !== 'free' &&
      a.type !== 'accommodation'
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

  if (routeActivities.length === 0 && altEntries.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-[11px] text-[#9ca3af]"
        style={{ height: 'calc(100vh - 280px)', minHeight: 400 }}
      >
        No map data for this day
      </div>
    )
  }

  const routePositions: [number, number][] = routeActivities.map((a) => [a.lat!, a.lng!])
  const allPositions: [number, number][] = [
    ...routePositions,
    ...altEntries.map((e) => [e.alt.lat!, e.alt.lng!] as [number, number]),
  ]
  const center = allPositions[0] ?? ([35.6762, 139.6503] as [number, number])

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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <FitBounds positions={allPositions} />

        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
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

        {routeActivities.map((act, i) => {
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
            <span className="text-[#C0392B] mr-1">#{order}</span>
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
        <p className="text-[10px] text-[#6b7280] mb-2 leading-snug">📍 {activity.address}</p>
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
                      <span className="block text-[10px] text-[#9ca3af] mt-[1px]">
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
        <p className="text-[10px] text-[#6b7280] mb-3 leading-snug">📍 {alt.address}</p>
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
