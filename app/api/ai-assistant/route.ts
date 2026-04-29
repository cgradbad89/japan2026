import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { getLeg, type Activity, type Day, type KyotoOption } from '@/data/itinerary'

export const runtime = 'nodejs'

type Msg = { role: 'user' | 'assistant'; content: string }

function findDay(dayId: string): Day | null {
  for (const legId of ['golden-week', 'hokkaido'] as const) {
    const leg = getLeg(legId)
    if (!leg) continue
    const d = leg.days.find((x) => x.id === dayId)
    if (d) return d
  }
  return null
}

function buildSystemPrompt(
  day: Day,
  activities: Activity[],
  ideas: string[],
  kyotoOptions?: KyotoOption[]
): string {
  const activityLines = activities
    .map((a) => {
      let line = `- ${a.time || ''} ${a.title} (${a.type})`
      if (a.address) line += ` — ${a.address}`
      if (a.highlight) line += `. Highlight: ${a.highlight}`
      if (a.note) line += `. Note: ${a.note}`
      if (a.alternatives?.length) {
        line += `. Meal alternatives: ${a.alternatives.map((alt) => alt.name).join(', ')}`
      }
      return line
    })
    .join('\n')

  const ideasLine = ideas.length
    ? `\nOptional ideas for this day: ${ideas.join(', ')}`
    : ''

  const kyotoLine =
    kyotoOptions && kyotoOptions.length > 0
      ? `\nThis is an open planning day. Available options the family can choose from:\n${kyotoOptions.map((o) => `- ${o.title}${o.type === 'daytrip' ? ' (day trip)' : ''}${o.description ? ': ' + o.description : ''}`).join('\n')}`
      : ''

  const legDescription =
    day.leg === 'golden-week' ? 'Golden Week (5 Adults)' : 'Hokkaido (John & Sabrina)'

  return `You are a helpful Japan travel assistant for a family trip. You have detailed knowledge of Day ${day.dayNumber} of their itinerary.

Day: ${day.dayLabel} — ${day.title}
Leg: ${legDescription}

Today's activities:
${activityLines}${ideasLine}${kyotoLine}

You can help with: explaining sights and their cultural significance, restaurant recommendations and food descriptions, logistics and travel tips, cultural etiquette, what to expect at each location, nearby alternatives, and any other questions about this day's plans.

Be concise, friendly, and practical. The family is traveling May 2026. When discussing specific places, be specific about what makes them special.`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const dayId: string | undefined = body?.dayId
    const messages: Msg[] = Array.isArray(body?.messages) ? body.messages : []
    const currentActivities: Activity[] | undefined = Array.isArray(body?.currentActivities)
      ? body.currentActivities
      : undefined
    const currentIdeas: string[] | undefined = Array.isArray(body?.currentIdeas)
      ? body.currentIdeas
      : undefined
    const currentKyotoOptions: KyotoOption[] | undefined = Array.isArray(body?.kyotoOptions)
      ? body.kyotoOptions
      : undefined

    if (!dayId) {
      return NextResponse.json({ error: 'Missing dayId' }, { status: 400 })
    }
    if (messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    const day = findDay(dayId)
    if (!day) {
      return NextResponse.json({ error: `Day not found: ${dayId}` }, { status: 404 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey.startsWith('placeholder')) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const client = new Anthropic({ apiKey })

    const conversation = messages
      .filter((m) => m && typeof m.content === 'string' && m.content.trim().length > 0)
      .map((m) => ({ role: m.role, content: m.content }))

    const effectiveActivities = currentActivities ?? day.activities
    const effectiveIdeas = currentIdeas ?? day.ideas ?? []

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: buildSystemPrompt(day, effectiveActivities, effectiveIdeas, currentKyotoOptions),
      messages: conversation,
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    const reply = textBlock && 'text' in textBlock ? textBlock.text : ''

    return NextResponse.json({ reply })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('AI assistant error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
