const MY_HUB_URL = 'https://my-hub-drab.vercel.app/'

export default function HubBanner() {
  return (
    <div className="w-full bg-[#C0392B] text-white text-xs">
      <div className="max-w-4xl mx-auto px-4 flex items-center" style={{ minHeight: 44 }}>
        <a
          href={MY_HUB_URL}
          className="hover:underline font-medium tracking-wide inline-flex items-center"
          style={{ minHeight: 44, padding: '10px 4px 10px 0' }}
        >
          ← my hub
        </a>
      </div>
    </div>
  )
}
