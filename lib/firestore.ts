import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  deleteField,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Activity, Accommodation, MealAlternative } from '@/data/itinerary'

// ---------- Checkoffs ----------

export function subscribeToCheckoffs(
  callback: (data: Record<string, boolean>) => void
): () => void {
  return onSnapshot(collection(db, 'checkoffs'), (snap) => {
    const map: Record<string, boolean> = {}
    snap.forEach((d) => {
      const v = d.data()
      if (v && v.completed) map[d.id] = true
    })
    callback(map)
  })
}

export async function toggleCheckoff(
  activityId: string,
  currentValue: boolean
): Promise<void> {
  const next = !currentValue
  await setDoc(
    doc(db, 'checkoffs', activityId),
    {
      completed: next,
      completedAt: next ? serverTimestamp() : null,
    },
    { merge: true }
  )
}

// ---------- Meal selections ----------

export function subscribeToMealSelections(
  callback: (data: Record<string, string>) => void
): () => void {
  return onSnapshot(collection(db, 'mealSelections'), (snap) => {
    const map: Record<string, string> = {}
    snap.forEach((d) => {
      const v = d.data()
      if (v && typeof v.selectedAltId === 'string' && v.selectedAltId) {
        map[d.id] = v.selectedAltId
      }
    })
    callback(map)
  })
}

export async function setMealSelection(
  activityId: string,
  altId: string
): Promise<void> {
  await setDoc(
    doc(db, 'mealSelections', activityId),
    { selectedAltId: altId },
    { merge: true }
  )
}

export async function clearMealSelection(activityId: string): Promise<void> {
  await setDoc(
    doc(db, 'mealSelections', activityId),
    { selectedAltId: deleteField() },
    { merge: true }
  )
}

// ---------- Day overrides ----------

function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as unknown as T
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue
      out[k] = stripUndefined(v)
    }
    return out as T
  }
  return value
}

export function subscribeToDay(
  dayId: string,
  callback: (activities: Activity[] | null) => void
): () => void {
  return onSnapshot(doc(db, 'dayOverrides', dayId), (snap) => {
    if (!snap.exists()) return callback(null)
    const data = snap.data()
    if (data && Array.isArray(data.activities)) {
      callback(data.activities as Activity[])
    } else {
      callback(null)
    }
  })
}

export async function saveDayActivities(
  dayId: string,
  activities: Activity[]
): Promise<void> {
  await setDoc(doc(db, 'dayOverrides', dayId), {
    activities: stripUndefined(activities),
  })
}

// ---------- Stay overrides ----------

export function subscribeToStays(
  leg: string,
  callback: (stays: Accommodation[] | null) => void
): () => void {
  return onSnapshot(doc(db, 'stayOverrides', leg), (snap) => {
    if (!snap.exists()) return callback(null)
    const data = snap.data()
    if (data && Array.isArray(data.stays)) {
      callback(data.stays as Accommodation[])
    } else {
      callback(null)
    }
  })
}

export async function saveStays(
  leg: string,
  stays: Accommodation[]
): Promise<void> {
  await setDoc(doc(db, 'stayOverrides', leg), {
    stays: stripUndefined(stays),
  })
}

// ---------- Alternatives (writes to dayOverrides) ----------

export async function addAlternative(
  dayId: string,
  activityId: string,
  alt: MealAlternative,
  allActivities: Activity[]
): Promise<void> {
  const updated = allActivities.map((a) => {
    if (a.id !== activityId) return a
    const existing = a.alternatives ?? []
    return { ...a, alternatives: [...existing, alt] }
  })
  await saveDayActivities(dayId, updated)
}
