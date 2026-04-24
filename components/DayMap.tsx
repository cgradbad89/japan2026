'use client'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import type { Accommodation, Activity, ActivityType, MealAlternative, Day } from '@/data/itinerary'

const ActivityModal = dynamic(() => import('@/components/ActivityModal'), { ssr: false })

// Fix default Leaflet marker paths under webpack/Next
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

function parseAccDate(str: string): string {
  const [mon, d] = str.trim().split(' ')
  const month = String((MONTH_MAP[mon] ?? 0) + 1).padStart(2, '0')
  const day = String(d).padStart(2, '0')
  return `2026-${month}-${day}`
}

const STAY_COORDS: Record<string, { lat: number; lng: number }> = {
  'gw-stay-1': { lat: 35.6284, lng: 139.7387 }, // Shinagawa Hotel
  'gw-stay-2': { lat: 34.9977, lng: 135.759 }, // Kyoto Rental
  'gw-stay-3': { lat: 35.5793, lng: 139.7348 }, // Omori Rental
  'hk-stay-1': { lat: 43.0686, lng: 141.3508 }, // Royal Park Canvas Sapporo
  'hk-stay-2': { lat: 42.9984, lng: 141.1243 }, // Jozankei Yurakusoan
  'hk-stay-3': { lat: 43.0686, lng: 141.3508 }, // Royal Park Canvas Sapporo (return)
}

const typePinColor: Record<ActivityType, string> = {
  sightseeing: '#C0392B',
  meal: '#B8860B',
  transport: '#6b7280',
  entertainment: '#7c3aed',
  free: '#9ca3af',
  accommodation: '#9ca3af',
}

function makeNumberedIcon(num: number, color: string) {
  return L.divIcon({
    html: `<div style="position:relative;width:36px;height:36px;">
      <div style="width:36px;height:36px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:14px;">${num}</div>
    </div>`,
    className: 'leaflet-pin-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

function makeAltIcon() {
  return L.divIcon({
    html: `<div style="width:24px;height:24px;border-radius:50%;background:white;border:2px solid #B8860B;opacity:0.65;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>`,
    className: 'leaflet-pin-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

function makeAccommodationIcon() {
  return L.divIcon({
    html: `<div style="width:38px;height:38px;border-radius:50%;background:#7c3aed;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.3);">🏨</div>`,
    className: 'leaflet-pin-icon',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
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

// Leaflet click events carry .originalEvent (DOM event). Stop the DOM event
// from bubbling into the map so clicking a marker does NOT pan or zoom.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stopMapPropagation(e: any) {
  if (e?.originalEvent) L.DomEvent.stopPropagation(e.originalEvent)
}

export default function DayMap({
  day,
  mealSelections,
  onSelectAlt,
  accommodations,
}: {
  day: Day
  mealSelections: Record<string, string>
  onSelectAlt: (activityId: string, altId: string) => void
  accommodations: Accommodation[]
}) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  // Activities that get numbered pins (excludes free and accommodation)
  const numberedPins = day.activities.filter(
    (a) =>
      a.lat !== undefined &&
      a.lng !== undefined &&
      a.type !== 'free' &&
      a.type !== 'accommodation'
  )

  const accommodationActivities = day.activities.filter(
    (a) => a.lat !== undefined && a.lng !== undefined && a.type === 'accommodation'
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
        style={{ height: 'calc(100dvh - 220px)', minHeight: 400 }}
      >
        No map data for this day
      </div>
    )
  }

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
  }
  const polylinePositions: [number, number][] = [
    ...prependCoords,
    ...basePositions,
    ...appendCoords,
  ]

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

  const openActivityModal = (a: Activity) => setSelectedActivity(a)

  const makeSyntheticAccommodation = (acc: Accommodation): Activity => ({
    id: acc.id,
    title: acc.name,
    type: 'accommodation',
    address: acc.address,
    highlight: acc.notes || undefined,
    note: `${acc.checkIn} → ${acc.checkOut} · ${acc.nights} nights`,
  })

  return (
    <div
      className="relative"
      style={{ height: 'calc(100dvh - 220px)', minHeight: 400 }}
    >
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          subdomains="abcd"
          maxZoom={19}
        />
        <FitBounds positions={allPositions} />

        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{ color: '#C0392B', weight: 3, dashArray: '6 4', opacity: 0.7 }}
          />
        )}

        {altEntries.map(({ parent, alt }) => (
          <Marker
            key={alt.id}
            position={[alt.lat!, alt.lng!]}
            icon={makeAltIcon()}
            zIndexOffset={-100}
            eventHandlers={{
              click: (e) => {
                stopMapPropagation(e)
                onSelectAlt(parent.id, alt.id)
                openActivityModal(parent)
              },
            }}
          />
        ))}

        {accommodationActivities.map((act) => (
          <Marker
            key={act.id}
            position={[act.lat!, act.lng!]}
            icon={makeAccommodationIcon()}
            zIndexOffset={500}
            eventHandlers={{
              click: (e) => {
                stopMapPropagation(e)
                openActivityModal(act)
              },
            }}
          />
        ))}

        {dayAccommodations.map((acc) => {
          const coords = STAY_COORDS[acc.id]
          const synthetic = makeSyntheticAccommodation(acc)
          return (
            <Marker
              key={acc.id}
              position={[coords.lat, coords.lng]}
              icon={makeAccommodationIcon()}
              zIndexOffset={500}
              eventHandlers={{
                click: (e) => {
                  stopMapPropagation(e)
                  openActivityModal(synthetic)
                },
              }}
            />
          )
        })}

        {numberedPins.map((act, i) => {
          const color = typePinColor[act.type]
          return (
            <Marker
              key={act.id}
              position={[act.lat!, act.lng!]}
              icon={makeNumberedIcon(i + 1, color)}
              zIndexOffset={1000}
              eventHandlers={{
                click: (e) => {
                  stopMapPropagation(e)
                  openActivityModal(act)
                },
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
            className="flex gap-1.5 overflow-x-auto no-scrollbar"
            style={{
              pointerEvents: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehaviorX: 'contain',
            } as React.CSSProperties}
          >
            {dayAccommodations.map((acc) => {
              const synthetic = makeSyntheticAccommodation(acc)
              return (
                <button
                  key={acc.id}
                  onClick={() => openActivityModal(synthetic)}
                  className="flex-shrink-0 flex items-center gap-1 px-3 rounded-full text-white text-[11px] font-bold whitespace-nowrap"
                  style={{ background: '#7c3aed', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', minHeight: 36 }}
                >
                  <span>🏨</span>
                  <span className="text-[10px] font-normal opacity-90 max-w-[80px] truncate">
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
                  onClick={() => openActivityModal(act)}
                  className="flex-shrink-0 flex items-center gap-1 px-3 rounded-full text-white text-[11px] font-bold whitespace-nowrap"
                  style={{ background: chipColor, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', minHeight: 36 }}
                >
                  <span>{isAccom ? '🏨' : routeIdx + 1}</span>
                  <span className="text-[10px] font-normal opacity-90 max-w-[80px] truncate">
                    {act.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <ActivityModal
        activity={selectedActivity}
        mealSelections={mealSelections}
        onSelectAlt={onSelectAlt}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  )
}
