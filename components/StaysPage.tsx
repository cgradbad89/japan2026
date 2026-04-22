'use client'

import { useEffect, useState } from 'react'
import type { Accommodation } from '@/data/itinerary'
import { saveStays, subscribeToStays } from '@/lib/firestore'

type StayType = Accommodation['type']

const typeColor: Record<StayType, string> = {
  hotel: '#C0392B',
  rental: '#B8860B',
  ryokan: '#7c3aed',
}

const typeIcon: Record<StayType, string> = {
  hotel: '🏨',
  rental: '🏠',
  ryokan: '🏯',
}

const typeLabel: Record<StayType, string> = {
  hotel: 'Hotel',
  rental: 'Rental',
  ryokan: 'Ryokan',
}

const ALL_TYPES: StayType[] = ['hotel', 'rental', 'ryokan']

type StayFormFields = {
  name: string
  type: StayType
  checkIn: string
  checkOut: string
  nights: string
  address: string
  bookingUrl: string
  notes: string
}

function blankFields(): StayFormFields {
  return {
    name: '',
    type: 'hotel',
    checkIn: '',
    checkOut: '',
    nights: '',
    address: '',
    bookingUrl: '',
    notes: '',
  }
}

function fieldsFromStay(s: Accommodation): StayFormFields {
  return {
    name: s.name ?? '',
    type: s.type,
    checkIn: s.checkIn ?? '',
    checkOut: s.checkOut ?? '',
    nights: s.nights?.toString() ?? '',
    address: s.address ?? '',
    bookingUrl: s.bookingUrl ?? '',
    notes: s.notes ?? '',
  }
}

function applyFields(base: Partial<Accommodation>, f: StayFormFields): Accommodation {
  const nights = parseInt(f.nights, 10)
  return {
    id: base.id as string,
    name: f.name.trim(),
    type: f.type,
    checkIn: f.checkIn.trim(),
    checkOut: f.checkOut.trim(),
    nights: isNaN(nights) ? 0 : nights,
    address: f.address.trim(),
    bookingUrl: f.bookingUrl.trim(),
    notes: f.notes.trim(),
    ...(base.isTBD ? { isTBD: base.isTBD } : {}),
  }
}

function StayEditForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: StayFormFields
  onSave: (f: StayFormFields) => Promise<void> | void
  onCancel: () => void
}) {
  const [f, setF] = useState<StayFormFields>(initial)
  const [saving, setSaving] = useState(false)
  const inputCls =
    'w-full text-[11px] border border-[#e5e7eb] rounded px-2 py-1.5 focus:outline-none focus:border-[#C0392B]'

  return (
    <div className="mt-2 p-2 bg-[#fafaf8] border border-[#e5e7eb] rounded space-y-1.5">
      <input
        className={inputCls}
        placeholder="Property name"
        value={f.name}
        onChange={(e) => setF({ ...f, name: e.target.value })}
      />
      <select
        className={inputCls}
        value={f.type}
        onChange={(e) => setF({ ...f, type: e.target.value as StayType })}
      >
        {ALL_TYPES.map((t) => (
          <option key={t} value={t}>
            {typeIcon[t]} {typeLabel[t]}
          </option>
        ))}
      </select>
      <div className="flex gap-1.5">
        <input
          className={inputCls}
          placeholder="Check-in"
          value={f.checkIn}
          onChange={(e) => setF({ ...f, checkIn: e.target.value })}
        />
        <input
          className={inputCls}
          placeholder="Check-out"
          value={f.checkOut}
          onChange={(e) => setF({ ...f, checkOut: e.target.value })}
        />
      </div>
      <input
        className={inputCls}
        placeholder="Nights"
        type="number"
        value={f.nights}
        onChange={(e) => setF({ ...f, nights: e.target.value })}
      />
      <input
        className={inputCls}
        placeholder="Address"
        value={f.address}
        onChange={(e) => setF({ ...f, address: e.target.value })}
      />
      <input
        className={inputCls}
        placeholder="Booking URL"
        value={f.bookingUrl}
        onChange={(e) => setF({ ...f, bookingUrl: e.target.value })}
      />
      <textarea
        className={inputCls}
        placeholder="Notes"
        rows={2}
        value={f.notes}
        onChange={(e) => setF({ ...f, notes: e.target.value })}
      />
      <div className="flex gap-2 pt-1">
        <button
          disabled={saving || !f.name.trim()}
          onClick={async () => {
            setSaving(true)
            try {
              await onSave(f)
            } finally {
              setSaving(false)
            }
          }}
          className="flex-1 text-[11px] font-semibold text-white bg-[#C0392B] rounded px-2 py-1.5 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 text-[11px] font-medium text-[#6b7280] bg-white border border-[#e5e7eb] rounded px-2 py-1.5"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function StayCard({
  stay,
  editMode,
  onSaveEdit,
  onRemove,
}: {
  stay: Accommodation
  editMode: boolean
  onSaveEdit: (next: Accommodation) => Promise<void>
  onRemove: () => void
}) {
  const color = typeColor[stay.type]
  const [editing, setEditing] = useState(false)

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
          {editMode && (
            <button
              onClick={() => setEditing(!editing)}
              className="flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] text-[#C0392B] hover:bg-[#fff8f8] border border-[#fde8e8]"
              aria-label="edit stay"
            >
              ✎
            </button>
          )}
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

        {editMode && editing && (
          <StayEditForm
            initial={fieldsFromStay(stay)}
            onCancel={() => setEditing(false)}
            onSave={async (f) => {
              const next = applyFields(stay, f)
              await onSaveEdit(next)
              setEditing(false)
            }}
          />
        )}

        {editMode && (
          <div className="mt-2 pt-2 border-t border-[#f3f4f6] flex items-center justify-end">
            <button
              onClick={onRemove}
              className="text-[10px] text-[#C0392B] hover:text-[#8b1f15] font-medium"
            >
              ✕ Remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function StaysPage({
  accommodations,
  leg,
  editMode,
}: {
  accommodations: Accommodation[]
  leg: string
  editMode: boolean
}) {
  const [override, setOverride] = useState<Accommodation[] | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    const unsub = subscribeToStays(leg, setOverride)
    return unsub
  }, [leg])

  const stays = override ?? accommodations
  const totalProperties = stays.length
  const totalNights = stays.reduce((s, a) => s + (a.nights || 0), 0)
  const cities = new Set(
    stays.map((a) => {
      const parts = (a.address || '').split(',').map((p) => p.trim())
      return parts[parts.length - 2] || parts[0] || ''
    })
  ).size

  const handleSaveEdit = async (updated: Accommodation) => {
    const next = stays.map((s) => (s.id === updated.id ? updated : s))
    await saveStays(leg, next)
  }

  const handleRemove = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Remove this accommodation?')) return
    const next = stays.filter((s) => s.id !== id)
    await saveStays(leg, next)
  }

  const handleAdd = async (f: StayFormFields) => {
    const id = `${leg}-stay-${Date.now()}`
    const next = applyFields({ id }, f)
    await saveStays(leg, [...stays, next])
    setShowAdd(false)
  }

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

      {stays.map((stay) => (
        <StayCard
          key={stay.id}
          stay={stay}
          editMode={editMode}
          onSaveEdit={handleSaveEdit}
          onRemove={() => handleRemove(stay.id)}
        />
      ))}

      {editMode && (
        <div className="mt-2">
          {showAdd ? (
            <div className="border-2 border-dashed border-[#C0392B] rounded-lg p-2 bg-white">
              <p className="text-[11px] font-semibold text-[#C0392B] mb-2">
                + Add accommodation
              </p>
              <StayEditForm
                initial={blankFields()}
                onCancel={() => setShowAdd(false)}
                onSave={handleAdd}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full border-2 border-dashed border-[#C0392B] text-[#C0392B] rounded-lg py-3 text-[11px] font-semibold hover:bg-[#fff8f8] transition-colors"
            >
              + Add accommodation
            </button>
          )}
        </div>
      )}
    </div>
  )
}
