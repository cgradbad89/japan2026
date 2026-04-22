import Link from 'next/link'
import HubBanner from '@/components/HubBanner'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <HubBanner />
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-[#1a1a1a] tracking-tight">
          404
        </h1>
        <p className="text-base text-[#1a1a1a] mt-3 font-semibold">Page not found</p>
        <p className="text-[13px] text-[#6b7280] mt-2">
          This page got lost somewhere between Tokyo and Kyoto 🗺
        </p>
        <Link
          href="/"
          className="inline-block mt-6 text-[12px] font-semibold text-white rounded-md px-5 py-2.5"
          style={{ backgroundColor: '#C0392B' }}
        >
          ← Back to home
        </Link>
      </main>
    </div>
  )
}
