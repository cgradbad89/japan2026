'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type {
  Activity,
  ActivityType,
  Day,
  MealAlternative,
} from '@/data/itinerary'
import {
  addAlternative,
  clearMealSelection,
  saveDayActivities,
  saveIdeas,
  setMealSelection,
  subscribeToCheckoffs,
  subscribeToMealSelections,
  toggleCheckoff,
} from '@/lib/firestore'

const DayMap = dynamic(() => import('@/components/DayMap'), { ssr: false })
const AIDrawer = dynamic(() => import('@/components/AIDrawer'), { ssr: false })

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

const ALL_TYPES: ActivityType[] = [
  'transport',
  'sightseeing',
  'meal',
  'entertainment',
  'free',
  'accommodation',
]

type ActivityFormFields = {
  time: string
  title: string
  type: ActivityType
  highlight: string
  note: string
  address: string
}

function blankFields(): ActivityFormFields {
  return {
    time: '',
    title: '',
    type: 'sightseeing',
    highlight: '',
    note: '',
    address: '',
  }
}

function fieldsFromActivity(a: Activity): ActivityFormFields {
  return {
    time: a.time ?? '',
    title: a.title ?? '',
    type: a.type,
    highlight: a.highlight ?? '',
    note: a.note ?? '',
    address: a.address ?? '',
  }
}

function applyFields(base: Partial<Activity>, f: ActivityFormFields): Activity {
  const next: Activity = {
    id: base.id as string,
    type: f.type,
    title: f.title.trim(),
  }
  if (f.time.trim()) next.time = f.time.trim()
  if (f.highlight.trim()) next.highlight = f.highlight.trim()
  if (f.note.trim()) next.note = f.note.trim()
  if (f.address.trim()) next.address = f.address.trim()
  if (base.description) next.description = base.description
  if (base.lat !== undefined) next.lat = base.lat
  if (base.lng !== undefined) next.lng = base.lng
  if (base.alternatives) next.alternatives = base.alternatives
  if (base.isTBD) next.isTBD = base.isTBD
  return next
}

function ActivityEditForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ActivityFormFields
  onSave: (f: ActivityFormFields) => Promise<void> | void
  onCancel: () => void
}) {
  const [f, setF] = useState<ActivityFormFields>(initial)
  const [saving, setSaving] = useState(false)

  const inputCls =
    'w-full text-[11px] border border-[#e5e7eb] rounded px-2 py-1.5 focus:outline-none focus:border-[#C0392B]'

  return (
    <div className="mt-2 p-2 bg-[#fafaf8] border border-[#e5e7eb] rounded space-y-1.5">
      <input
        className={inputCls}
        placeholder="Time"
        value={f.time}
        onChange={(e) => setF({ ...f, time: e.target.value })}
      />
      <input
        className={inputCls}
        placeholder="Title"
        value={f.title}
        onChange={(e) => setF({ ...f, title: e.target.value })}
      />
      <select
        className={inputCls}
        value={f.type}
        onChange={(e) => setF({ ...f, type: e.target.value as ActivityType })}
      >
        {ALL_TYPES.map((t) => (
          <option key={t} value={t}>
            {typeEmoji[t]} {t}
          </option>
        ))}
      </select>
      <textarea
        className={inputCls}
        placeholder="Highlight (optional)"
        rows={2}
        value={f.highlight}
        onChange={(e) => setF({ ...f, highlight: e.target.value })}
      />
      <textarea
        className={inputCls}
        placeholder="Note (optional)"
        rows={2}
        value={f.note}
        onChange={(e) => setF({ ...f, note: e.target.value })}
      />
      <input
        className={inputCls}
        placeholder="Address (optional)"
        value={f.address}
        onChange={(e) => setF({ ...f, address: e.target.value })}
      />
      <div className="flex gap-2 pt-1">
        <button
          disabled={saving || !f.title.trim()}
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

type AltFormFields = { name: string; note: string; address: string }

function AltEditForm({
  onSave,
  onCancel,
}: {
  onSave: (f: AltFormFields) => Promise<void> | void
  onCancel: () => void
}) {
  const [f, setF] = useState<AltFormFields>({ name: '', note: '', address: '' })
  const [saving, setSaving] = useState(false)
  const inputCls =
    'w-full text-[10px] border border-[#e5e7eb] rounded px-1.5 py-1 focus:outline-none focus:border-[#B8860B]'
  return (
    <div className="mt-1 p-1.5 bg-white border border-[#B8860B] rounded space-y-1">
      <input
        className={inputCls}
        placeholder="Name (required)"
        value={f.name}
        onChange={(e) => setF({ ...f, name: e.target.value })}
      />
      <input
        className={inputCls}
        placeholder="Note (optional)"
        value={f.note}
        onChange={(e) => setF({ ...f, note: e.target.value })}
      />
      <input
        className={inputCls}
        placeholder="Address (optional)"
        value={f.address}
        onChange={(e) => setF({ ...f, address: e.target.value })}
      />
      <div className="flex gap-1 pt-0.5">
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
          className="flex-1 text-[10px] font-semibold text-white bg-[#B8860B] rounded px-1.5 py-1 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 text-[10px] font-medium text-[#6b7280] bg-white border border-[#e5e7eb] rounded px-1.5 py-1"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function ActivityCard({
  activity,
  editMode,
  checked,
  onToggleCheck,
  selectedAltId,
  onSelectAlt,
  onSaveEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddAlt,
  canMoveUp,
  canMoveDown,
}: {
  activity: Activity
  editMode: boolean
  checked: boolean
  onToggleCheck: () => void
  selectedAltId?: string
  onSelectAlt: (altId: string) => void
  onSaveEdit: (next: Activity) => Promise<void>
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAddAlt: (alt: MealAlternative) => Promise<void>
  canMoveUp: boolean
  canMoveDown: boolean
}) {
  const color = typeColor[activity.type]
  const [altsOpen, setAltsOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [addingAlt, setAddingAlt] = useState(false)
  const hasAlternatives = activity.alternatives && activity.alternatives.length > 0

  const selectedAlt = selectedAltId
    ? activity.alternatives?.find((a) => a.id === selectedAltId)
    : undefined
  const displayTitle = selectedAlt?.name ?? activity.title

  return (
    <div
      className="flex-1 rounded-lg bg-white"
      onClick={(e) => {
        if (editMode) return
        const t = e.target as HTMLElement
        if (t.closest('button, input, textarea, a')) return
        onToggleCheck()
      }}
      style={{
        padding: '10px',
        borderLeft: `2px solid ${color}`,
        border: '0.5px solid #e5e7eb',
        borderLeftWidth: '2px',
        borderLeftColor: color,
        backgroundColor: activity.isTBD ? '#fffaf0' : '#ffffff',
        cursor: editMode ? 'default' : 'pointer',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <span className="text-[11px] leading-none mt-[1px]">{typeEmoji[activity.type]}</span>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[11px] leading-snug text-[#1a1a1a]">
              {displayTitle}
              {activity.isTBD && (
                <span className="ml-1.5 inline-block px-1 py-[1px] text-[8px] font-semibold rounded bg-yellow-200 text-yellow-900 align-middle">
                  TBD
                </span>
              )}
            </h3>
            {selectedAlt && (
              <p className="text-[9px] text-[#9ca3af] line-through mt-[1px]">
                {activity.title}
              </p>
            )}
          </div>
        </div>
        {editMode ? (
          <button
            onClick={() => setEditing(!editing)}
            className="flex-shrink-0 w-[20px] h-[20px] rounded-full flex items-center justify-center text-[11px] text-[#C0392B] hover:bg-[#fff8f8] border border-[#fde8e8]"
            aria-label="edit"
          >
            ✎
          </button>
        ) : (
          <button
            onClick={onToggleCheck}
            className="flex-shrink-0 rounded-full flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              marginTop: -6,
              marginRight: -6,
              border: 'none',
              background: 'transparent',
            }}
            aria-label="mark done"
          >
            <span
              className="flex items-center justify-center rounded-full"
              style={{
                width: 18,
                height: 18,
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: checked ? '#16a34a' : '#d1d5db',
                backgroundColor: checked ? '#16a34a' : 'transparent',
              }}
            >
            {checked && (
              <svg
                viewBox="0 0 12 12"
                width="9"
                height="9"
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
          </button>
        )}
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
              {(() => {
                const originalSel = !selectedAltId || selectedAltId === activity.id
                return (
                  <button
                    key="__original__"
                    onClick={() => onSelectAlt(activity.id)}
                    className="w-full text-left flex items-start gap-1.5 p-1.5 rounded hover:bg-white transition-colors"
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
                      <span className="block text-[10px] font-medium text-[#1a1a1a]">
                        {activity.title}
                        <span className="ml-1 text-[9px] font-normal text-[#9ca3af]">
                          (original)
                        </span>
                      </span>
                      {activity.address && (
                        <span className="block text-[9px] text-[#9ca3af] mt-[1px]">
                          📍 {activity.address}
                        </span>
                      )}
                    </span>
                  </button>
                )
              })()}
              {activity.alternatives!.map((alt) => {
                const isSel = selectedAltId === alt.id
                return (
                  <button
                    key={alt.id}
                    onClick={() => onSelectAlt(alt.id)}
                    className="w-full text-left flex items-start gap-1.5 p-1.5 rounded hover:bg-white transition-colors"
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
                      <span className="block text-[10px] font-medium text-[#1a1a1a]">{alt.name}</span>
                      {alt.note && (
                        <span className="block text-[9px] text-[#6b7280] mt-[1px]">{alt.note}</span>
                      )}
                      {alt.address && (
                        <span className="block text-[9px] text-[#9ca3af] mt-[1px]">📍 {alt.address}</span>
                      )}
                    </span>
                  </button>
                )
              })}
              {editMode && activity.type === 'meal' && (
                <>
                  {addingAlt ? (
                    <AltEditForm
                      onCancel={() => setAddingAlt(false)}
                      onSave={async (f) => {
                        const newAlt: MealAlternative = {
                          id: `${activity.id}-alt${Date.now()}`,
                          name: f.name.trim(),
                        }
                        if (f.note.trim()) newAlt.note = f.note.trim()
                        if (f.address.trim()) newAlt.address = f.address.trim()
                        await onAddAlt(newAlt)
                        setAddingAlt(false)
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => setAddingAlt(true)}
                      className="w-full text-left text-[10px] text-[#B8860B] hover:text-[#8a6400] p-1.5 font-medium"
                    >
                      + Add alternative
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {editMode && !hasAlternatives && activity.type === 'meal' && (
        <div className="mt-2">
          {addingAlt ? (
            <AltEditForm
              onCancel={() => setAddingAlt(false)}
              onSave={async (f) => {
                const newAlt: MealAlternative = {
                  id: `${activity.id}-alt${Date.now()}`,
                  name: f.name.trim(),
                }
                if (f.note.trim()) newAlt.note = f.note.trim()
                if (f.address.trim()) newAlt.address = f.address.trim()
                await onAddAlt(newAlt)
                setAddingAlt(false)
              }}
            />
          ) : (
            <button
              onClick={() => setAddingAlt(true)}
              className="text-[10px] font-medium text-[#B8860B] hover:text-[#8a6400]"
            >
              + Add alternative
            </button>
          )}
        </div>
      )}

      {editMode && editing && (
        <ActivityEditForm
          initial={fieldsFromActivity(activity)}
          onCancel={() => setEditing(false)}
          onSave={async (f) => {
            const next = applyFields(activity, f)
            await onSaveEdit(next)
            setEditing(false)
          }}
        />
      )}

      {editMode && (
        <div className="mt-2 pt-2 border-t border-[#f3f4f6] flex items-center gap-2 text-[10px]">
          <button
            disabled={!canMoveUp}
            onClick={onMoveUp}
            className="text-[#6b7280] hover:text-[#1a1a1a] disabled:opacity-30"
          >
            ⬆ Up
          </button>
          <button
            disabled={!canMoveDown}
            onClick={onMoveDown}
            className="text-[#6b7280] hover:text-[#1a1a1a] disabled:opacity-30"
          >
            ⬇ Down
          </button>
          <button
            onClick={onRemove}
            className="ml-auto text-[#C0392B] hover:text-[#8b1f15] font-medium"
          >
            ✕ Remove
          </button>
        </div>
      )}
    </div>
  )
}

function IdeasSection({
  ideas,
  editMode,
  onAdd,
  onRemove,
}: {
  ideas: string[]
  editMode: boolean
  onAdd: (text: string) => Promise<void>
  onRemove: (index: number) => Promise<void>
}) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)

  if (!editMode && ideas.length === 0) return null

  return (
    <div className="mt-2 pt-3 border-t border-[#e5e7eb]">
      <h3
        className="text-[11px] font-medium text-[#6b7280] uppercase"
        style={{ letterSpacing: '0.08em' }}
      >
        💡 Ideas for this day
      </h3>
      <p className="text-[9px] text-[#9ca3af] italic mt-[2px] mb-2">
        Not in the plan — optional additions
      </p>

      <div className="space-y-1.5">
        {ideas.map((idea, i) => (
          <div
            key={`${idea}-${i}`}
            className="rounded-lg flex items-start gap-2"
            style={{
              background: '#fafaf8',
              border: '0.5px solid #e5e7eb',
              borderLeft: '2px solid #d1d5db',
              padding: '8px 10px',
            }}
          >
            <span className="text-[12px] leading-none mt-[1px]">💡</span>
            <span className="flex-1 text-[10px] italic text-[#6b7280] leading-snug">
              {idea}
            </span>
            {editMode && (
              <button
                onClick={() => onRemove(i)}
                className="flex-shrink-0 text-[11px] text-[#9ca3af] hover:text-[#C0392B] leading-none"
                aria-label="remove idea"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {editMode && (
        <div className="mt-2">
          {adding ? (
            <div
              className="border-2 border-dashed rounded-lg p-2 bg-white"
              style={{ borderColor: '#6b7280' }}
            >
              <input
                type="text"
                value={draft}
                autoFocus
                placeholder="Add an idea…"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    ;(async () => {
                      if (!draft.trim() || saving) return
                      setSaving(true)
                      try {
                        await onAdd(draft)
                        setDraft('')
                        setAdding(false)
                      } finally {
                        setSaving(false)
                      }
                    })()
                  }
                }}
                className="w-full text-[12px] border border-[#e5e7eb] rounded px-2 py-1.5 focus:outline-none focus:border-[#6b7280]"
                style={{ fontSize: 16 }}
              />
              <div className="flex gap-2 pt-2">
                <button
                  disabled={saving || !draft.trim()}
                  onClick={async () => {
                    setSaving(true)
                    try {
                      await onAdd(draft)
                      setDraft('')
                      setAdding(false)
                    } finally {
                      setSaving(false)
                    }
                  }}
                  className="flex-1 text-[11px] font-semibold text-white rounded px-2 py-2 disabled:opacity-50"
                  style={{ background: '#6b7280' }}
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setAdding(false)
                    setDraft('')
                  }}
                  className="flex-1 text-[11px] font-medium text-[#6b7280] bg-white border border-[#e5e7eb] rounded px-2 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="w-full border-2 border-dashed text-[#6b7280] rounded-lg py-3 text-[11px] font-semibold hover:bg-[#fafaf8] transition-colors"
              style={{ borderColor: '#6b7280' }}
            >
              + Add idea
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function DayTimeline({
  day,
  editMode,
}: {
  day: Day
  editMode: boolean
}) {
  const [checkoffs, setCheckoffs] = useState<Record<string, boolean>>({})
  const [mealSelections, setMealSelections] = useState<Record<string, string>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [tab, setTab] = useState<'timeline' | 'map'>('timeline')
  const [aiOpen, setAiOpen] = useState(false)

  useEffect(() => {
    // reset the inner tab & AI drawer when switching days
    setTab('timeline')
    setAiOpen(false)
  }, [day.id])

  useEffect(() => {
    const u1 = subscribeToCheckoffs(setCheckoffs)
    const u2 = subscribeToMealSelections(setMealSelections)
    return () => {
      u1()
      u2()
    }
  }, [])

  const actionable = day.activities.filter(
    (a) => a.type !== 'free' && a.type !== 'accommodation'
  )
  const totalActs = actionable.length
  const completedCount = actionable.filter((a) => checkoffs[a.id]).length
  const pct = totalActs > 0 ? (completedCount / totalActs) * 100 : 0

  const handleToggle = async (id: string) => {
    const current = !!checkoffs[id]
    setCheckoffs((prev) => ({ ...prev, [id]: !current }))
    try {
      await toggleCheckoff(id, current)
    } catch {
      setCheckoffs((prev) => ({ ...prev, [id]: current }))
    }
  }

  const handleSelectAlt = async (activityId: string, altId: string) => {
    if (altId === activityId) {
      setMealSelections((prev) => {
        const next = { ...prev }
        delete next[activityId]
        return next
      })
      await clearMealSelection(activityId)
      return
    }
    setMealSelections((prev) => ({ ...prev, [activityId]: altId }))
    await setMealSelection(activityId, altId)
  }

  const handleSaveEdit = async (updated: Activity) => {
    const next = day.activities.map((a) => (a.id === updated.id ? updated : a))
    await saveDayActivities(day.id, next)
  }

  const handleRemove = async (activityId: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Remove this activity?')) return
    const next = day.activities.filter((a) => a.id !== activityId)
    await saveDayActivities(day.id, next)
  }

  const handleMove = async (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= day.activities.length) return
    const arr = [...day.activities]
    ;[arr[index], arr[target]] = [arr[target], arr[index]]
    await saveDayActivities(day.id, arr)
  }

  const handleAddActivity = async (f: ActivityFormFields) => {
    const id = `d${day.dayNumber}-a${Date.now()}`
    const next = applyFields({ id }, f)
    await saveDayActivities(day.id, [...day.activities, next])
    setShowAddForm(false)
  }

  const handleAddAlt = async (activityId: string, alt: MealAlternative) => {
    await addAlternative(day.id, activityId, alt, day.activities)
  }

  const handleAddIdea = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const nextIdeas = [...(day.ideas ?? []), trimmed]
    await saveIdeas(day.id, nextIdeas, day.activities)
  }

  const handleRemoveIdea = async (index: number) => {
    if (typeof window !== 'undefined' && !window.confirm('Remove this idea?')) return
    const nextIdeas = (day.ideas ?? []).filter((_, i) => i !== index)
    await saveIdeas(day.id, nextIdeas, day.activities)
  }

  const handleAskClaude = () => {
    setAiOpen((prev) => !prev)
  }

  return (
    <div className="px-4 py-4">
      {editMode && (
        <div className="mb-3 flex items-center gap-2 bg-[#fff8f8] border border-[#fde8e8] rounded-lg px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C0392B] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C0392B]" />
          </span>
          <span className="text-[11px] font-semibold text-[#C0392B]">
            Edit mode — changes sync live
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl font-bold text-[#C0392B] leading-none">
              D{day.dayNumber}
            </span>
            {editMode && (
              <span className="inline-block px-1.5 py-[2px] rounded-full text-[9px] font-semibold bg-[#C0392B] text-white">
                ✎ Editing
              </span>
            )}
          </div>
          <h2 className="text-base font-semibold text-[#1a1a1a] mt-1">{day.title}</h2>
          <p className="text-[11px] text-[#6b7280] mt-[2px]">
            {day.dayLabel} · {day.travelers}
          </p>
        </div>
        <button
          onClick={handleAskClaude}
          className="flex-shrink-0 text-[11px] px-2.5 py-1.5 rounded-md transition-colors font-medium"
          style={{
            border: '1px solid #C0392B',
            color: aiOpen ? '#ffffff' : '#C0392B',
            backgroundColor: aiOpen ? '#C0392B' : 'transparent',
          }}
        >
          {aiOpen ? '✦ Close' : '✦ Ask Claude'}
        </button>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-1">
          <span>
            {completedCount} of {totalActs} activities
          </span>
          {totalActs > 0 && <span>{Math.round(pct)}%</span>}
        </div>
        <div className="h-[3px] bg-[#fde8e8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C0392B] transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex gap-5 border-b border-[#f3f4f6] mb-4">
        <button
          onClick={() => setTab('timeline')}
          className="relative py-2 text-[11px] font-semibold transition-colors"
          style={{ color: tab === 'timeline' ? '#C0392B' : '#6b7280' }}
        >
          Timeline
          {tab === 'timeline' && (
            <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-[#C0392B]" />
          )}
        </button>
        <button
          onClick={() => setTab('map')}
          className="relative py-2 text-[11px] font-semibold transition-colors"
          style={{ color: tab === 'map' ? '#C0392B' : '#6b7280' }}
        >
          Map
          {tab === 'map' && (
            <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-[#C0392B]" />
          )}
        </button>
      </div>

      {tab === 'map' && (
        <DayMap
          day={day}
          checkoffs={checkoffs}
          mealSelections={mealSelections}
          onToggleCheckoff={handleToggle}
          onSelectAlt={handleSelectAlt}
        />
      )}

      {tab === 'timeline' && (
      <>
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
                <ActivityCard
                  activity={act}
                  editMode={editMode}
                  checked={!!checkoffs[act.id]}
                  onToggleCheck={() => handleToggle(act.id)}
                  selectedAltId={mealSelections[act.id]}
                  onSelectAlt={(altId) => handleSelectAlt(act.id, altId)}
                  onSaveEdit={handleSaveEdit}
                  onRemove={() => handleRemove(act.id)}
                  onMoveUp={() => handleMove(idx, 'up')}
                  onMoveDown={() => handleMove(idx, 'down')}
                  onAddAlt={(alt) => handleAddAlt(act.id, alt)}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < day.activities.length - 1}
                />
              </div>
            </div>
          )
        })}
      </div>

      {editMode && (
        <div className="mt-3">
          {showAddForm ? (
            <div className="border-2 border-dashed border-[#C0392B] rounded-lg p-2 bg-white">
              <p className="text-[11px] font-semibold text-[#C0392B] mb-2">
                + Add activity to {day.title}
              </p>
              <ActivityEditForm
                initial={blankFields()}
                onCancel={() => setShowAddForm(false)}
                onSave={handleAddActivity}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full border-2 border-dashed border-[#C0392B] text-[#C0392B] rounded-lg py-3 text-[11px] font-semibold hover:bg-[#fff8f8] transition-colors"
            >
              + Add activity to {day.title}
            </button>
          )}
        </div>
      )}

      <IdeasSection
        ideas={day.ideas ?? []}
        editMode={editMode}
        onAdd={handleAddIdea}
        onRemove={handleRemoveIdea}
      />
      </>
      )}

      <AIDrawer
        day={day}
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        activities={day.activities}
        ideas={day.ideas ?? []}
        mealSelections={mealSelections}
        checkoffs={checkoffs}
      />
    </div>
  )
}
