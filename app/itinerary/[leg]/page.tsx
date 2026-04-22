import { notFound } from 'next/navigation'
import { getLeg } from '@/data/itinerary'
import LegView from './LegView'

export function generateStaticParams() {
  return [{ leg: 'golden-week' }, { leg: 'hokkaido' }]
}

export default function Page({ params }: { params: { leg: string } }) {
  const leg = getLeg(params.leg)
  if (!leg) notFound()
  return <LegView leg={leg} />
}
