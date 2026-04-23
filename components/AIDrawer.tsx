'use client'

import { useEffect, useRef, useState } from 'react'
import type { Activity, Day } from '@/data/itinerary'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function AIDrawer({
  day,
  isOpen,
  onClose,
  activities,
  ideas,
}: {
  day: Day
  isOpen: boolean
  onClose: () => void
  activities?: Activity[]
  ideas?: string[]
  mealSelections?: Record<string, string>
  checkoffs?: Record<string, boolean>
}) {
  const greeting: Msg = {
    role: 'assistant',
    content: `Hi! I'm your Day ${day.dayNumber} assistant. I know all about ${day.title} — ask me anything about today's activities, restaurants, or logistics.`,
  }

  const [messages, setMessages] = useState<Msg[]>([greeting])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const threadRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Reset conversation when day changes
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `Hi! I'm your Day ${day.dayNumber} assistant. I know all about ${day.title} — ask me anything about today's activities, restaurants, or logistics.`,
      },
    ])
    setInput('')
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day.id])

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [messages, loading])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [isOpen])

  const titles = day.activities.map((a) => a.title)
  const contextLabel =
    titles.length <= 3
      ? titles.join(', ')
      : `${titles.slice(0, 3).join(', ')} + ${titles.length - 3} more`

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const conversation: Msg[] = [...messages.filter((m) => m.role !== 'assistant' || m !== greeting).slice(messages[0] === greeting ? 1 : 0), { role: 'user', content: text }]
    // Send full history (skip the synthesized greeting)
    const sendable: Msg[] = [...messages.slice(1), { role: 'user', content: text }]
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayId: day.id,
          messages: sendable,
          currentActivities: activities ?? day.activities,
          currentIdeas: ideas ?? day.ideas ?? [],
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Something went wrong — try again.${
              data.error ? ` (${data.error})` : ''
            }`,
          },
        ])
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || '' }])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong — try again.' },
      ])
    } finally {
      setLoading(false)
    }
    // conversation is assembled above; suppress unused var warning
    void conversation
  }

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1999,
          }}
        />
      )}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2000,
          height: '55vh',
          background: 'white',
          borderRadius: '16px 16px 0 0',
          borderTop: '0.5px solid #e5e7eb',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform .3s ease',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
        }}
      >
        <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
          <div style={{ width: 32, height: 3, background: '#e5e7eb', borderRadius: 2 }} />
        </div>

        <div className="flex items-start justify-between gap-3 px-4 pt-1 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: '#C0392B' }}
            >
              ✦
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#1a1a1a] leading-tight">
                Day {day.dayNumber} Assistant
              </h3>
              <p className="text-[10px] text-[#6b7280] leading-tight">{day.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-full flex items-center justify-center text-[#6b7280] hover:bg-[#f3f4f6]"
            style={{ width: 44, height: 44, fontSize: 22 }}
            aria-label="close"
          >
            ×
          </button>
        </div>

        <div className="px-4 pb-2 flex-shrink-0">
          <p className="text-[10px] text-[#9ca3af] truncate">Context: {contextLabel}</p>
        </div>

        <div
          ref={threadRef}
          className="flex-1 overflow-y-auto px-4 py-2"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {messages.map((m, i) => {
            if (m.role === 'user') {
              return (
                <div key={i} className="flex justify-end">
                  <div
                    className="max-w-[85%] text-[12px] leading-snug px-2.5 py-1.5"
                    style={{
                      backgroundColor: '#fff1f0',
                      border: '1px solid #fecaca',
                      borderRadius: '8px 8px 0 8px',
                      color: '#1a1a1a',
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              )
            }
            return (
              <div key={i} className="flex justify-start">
                <div
                  className="w-full text-[12px] leading-snug px-2.5 py-1.5 whitespace-pre-wrap"
                  style={{
                    backgroundColor: '#fafaf8',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0 8px 8px 8px',
                    color: '#1a1a1a',
                  }}
                >
                  {m.content}
                </div>
              </div>
            )
          })}
          {loading && (
            <div className="flex justify-start">
              <div
                className="text-[12px] px-3 py-2"
                style={{
                  backgroundColor: '#fafaf8',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0 8px 8px 8px',
                }}
              >
                <span className="inline-flex gap-1">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          className="border-t border-[#e5e7eb] flex items-center gap-2 flex-shrink-0 bg-white"
          style={{
            padding: '12px',
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            onFocus={() => {
              // When iOS keyboard opens, scroll the thread so the latest
              // message is visible above the keyboard.
              setTimeout(() => {
                if (threadRef.current) {
                  threadRef.current.scrollTop = threadRef.current.scrollHeight
                }
              }, 300)
            }}
            placeholder={`Ask about Day ${day.dayNumber}...`}
            className="flex-1 px-4 rounded-full border border-[#e5e7eb] focus:outline-none focus:border-[#C0392B]"
            style={{ fontSize: 16, minHeight: 44 }}
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: '#C0392B', width: 44, height: 44, fontSize: 18 }}
            aria-label="send"
          >
            ↑
          </button>
        </div>

        <style jsx>{`
          .dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #9ca3af;
            display: inline-block;
            animation: pulse 1.2s ease-in-out infinite;
          }
          .dot:nth-child(2) {
            animation-delay: 0.2s;
          }
          .dot:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes pulse {
            0%,
            80%,
            100% {
              opacity: 0.3;
              transform: scale(0.8);
            }
            40% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </>
  )
}
