const MY_HUB_URL = 'https://my-hub-drab.vercel.app/'

export default function HubBanner() {
  return (
    <div className="w-full bg-[#C0392B] text-white text-xs">
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center">
        <a href={MY_HUB_URL} className="hover:underline font-medium tracking-wide">
          ← my hub
        </a>
      </div>
    </div>
  )
}
