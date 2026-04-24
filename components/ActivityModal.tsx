'use client'

import type { Activity, ActivityType, MealAlternative } from '@/data/itinerary'
import { googleMapsUrl } from '@/lib/maps'

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

export function resolveDisplay(
  activity: Activity,
  mealSelections: Record<string, string>
) {
  const selectedAltId = mealSelections[activity.id]
  const isOriginalSelected = !selectedAltId || selectedAltId === activity.id
  const selectedAlt: MealAlternative | null = !isOriginalSelected
    ? activity.alternatives?.find((a) => a.id === selectedAltId) ?? null
    : null

  const displayTitle = selectedAlt?.name ?? activity.title
  const displayAddress = selectedAlt
    ? selectedAlt.address
    : activity.address
  const displayHighlight = selectedAlt ? selectedAlt.note : activity.highlight
  const displayNote = selectedAlt ? undefined : activity.note

  return {
    selectedAltId,
    selectedAlt,
    isOriginalSelected,
    displayTitle,
    displayAddress,
    displayHighlight,
    displayNote,
  }
}

export default function ActivityModal({
  activity,
  mealSelections,
  onSelectAlt,
  onClose,
}: {
  activity: Activity | null
  mealSelections: Record<string, string>
  onSelectAlt: (activityId: string, altId: string) => void
  onClose: () => void
}) {
  if (!activity) return null

  const {
    selectedAltId,
    selectedAlt,
    isOriginalSelected,
    displayTitle,
    displayAddress,
    displayHighlight,
    displayNote,
  } = resolveDisplay(activity, mealSelections)

  const color = typePinColor[activity.type]
  const alts = activity.alternatives ?? []
  const hasAlternatives = alts.length > 0

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 3000,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(560px, 92vw)',
          maxHeight: '85vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 3001,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        {/* Header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: '#fafaf8',
            borderBottom: '0.5px solid #e5e7eb',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
            zIndex: 1,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 24, lineHeight: 1 }}>
                {typeEmoji[activity.type]}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  background: `${color}15`,
                  color,
                }}
              >
                {typeLabel[activity.type]}
              </span>
            </div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#1a1a1a',
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              {displayTitle}
            </h2>
            {activity.time && (
              <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 4, margin: 0 }}>
                {activity.time}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="close"
            style={{
              width: 44,
              height: 44,
              fontSize: 20,
              color: '#6b7280',
              background: 'transparent',
              border: 'none',
              borderRadius: 22,
              cursor: 'pointer',
              flexShrink: 0,
              marginTop: -6,
              marginRight: -10,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20 }}>
          {selectedAlt && (
            <div
              style={{
                display: 'inline-block',
                background: '#f3f4f6',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 11,
                fontStyle: 'italic',
                color: '#6b7280',
                marginBottom: 12,
              }}
            >
              ↩ Original: {activity.title}
            </div>
          )}

          {activity.description && (
            <p
              style={{
                fontSize: 13,
                color: '#374151',
                marginBottom: 12,
                lineHeight: 1.5,
              }}
            >
              {activity.description}
            </p>
          )}

          {displayAddress && (
            <p style={{ margin: 0, marginBottom: 12 }}>
              <a
                href={googleMapsUrl(displayAddress)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  color: '#6b7280',
                  textDecoration: 'underline',
                  textDecorationStyle: 'dotted',
                  textUnderlineOffset: 2,
                  display: 'inline-flex',
                  alignItems: 'flex-start',
                  gap: 4,
                  minHeight: 44,
                  padding: '10px 0',
                }}
              >
                <span>📍</span>
                <span>{displayAddress}</span>
              </a>
            </p>
          )}

          {displayHighlight && (
            <div
              style={{
                background: '#fff8f8',
                borderLeft: '3px solid #fca5a5',
                padding: '10px 14px',
                borderRadius: '0 8px 8px 0',
                fontSize: 13,
                fontStyle: 'italic',
                color: '#7f1d1d',
                margin: '12px 0',
                lineHeight: 1.5,
              }}
            >
              {displayHighlight}
            </div>
          )}

          {displayNote && (
            <div
              style={{
                background: '#f9fafb',
                borderLeft: '3px solid #e5e7eb',
                padding: '8px 12px',
                borderRadius: '0 6px 6px 0',
                fontSize: 12,
                color: '#6b7280',
                display: 'flex',
                gap: 6,
                alignItems: 'flex-start',
                marginBottom: 12,
                lineHeight: 1.5,
              }}
            >
              <span>💡</span>
              <span>{displayNote}</span>
            </div>
          )}

          {hasAlternatives && (
            <div style={{ marginTop: 16 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 8,
                  margin: 0,
                  marginBlockEnd: 8,
                }}
              >
                Options
              </p>

              <OptionRow
                selected={isOriginalSelected}
                onClick={() => onSelectAlt(activity.id, activity.id)}
                name={activity.title}
                address={activity.address}
                isOriginal
                accentColor={color}
              />

              {alts.map((alt) => (
                <OptionRow
                  key={alt.id}
                  selected={selectedAltId === alt.id}
                  onClick={() => onSelectAlt(activity.id, alt.id)}
                  name={alt.name}
                  note={alt.note}
                  address={alt.address}
                  accentColor={color}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function OptionRow({
  selected,
  onClick,
  name,
  note,
  address,
  isOriginal,
  accentColor,
}: {
  selected: boolean
  onClick: () => void
  name: string
  note?: string
  address?: string
  isOriginal?: boolean
  accentColor: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 48,
        padding: '10px 14px',
        border: `0.5px solid ${selected ? '#C0392B' : '#e5e7eb'}`,
        borderRadius: 8,
        marginBottom: 6,
        background: selected ? '#fff8f7' : '#fff',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: `1.5px solid ${selected ? accentColor : '#d1d5db'}`,
          background: selected ? accentColor : '#ffffff',
        }}
      />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 500,
            color: '#1a1a1a',
          }}
        >
          {name}
        </span>
        {note && (
          <span
            style={{
              display: 'block',
              fontSize: 11,
              color: '#6b7280',
              marginTop: 2,
            }}
          >
            {note}
          </span>
        )}
        {address && (
          <span
            style={{
              display: 'block',
              fontSize: 10,
              color: '#9ca3af',
              marginTop: 2,
            }}
          >
            📍 {address}
          </span>
        )}
      </span>
      {isOriginal && (
        <span
          style={{
            flexShrink: 0,
            fontSize: 9,
            color: '#9ca3af',
            fontStyle: 'italic',
          }}
        >
          (original)
        </span>
      )}
    </button>
  )
}
