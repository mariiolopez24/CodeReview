'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Props {
  planKey: string
  planName: string
  price: number
  isLoggedIn: boolean
}

export default function PricingButtons({ planKey, planName, price, isLoggedIn }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else if (res.status === 401) {
      window.location.href = '/login?redirect=/pricing'
    }
    setLoading(false)
  }

  if (price === 0) {
    return (
      <Link
        href={isLoggedIn ? '/dashboard' : '/signup'}
        className="w-full block text-center py-2 rounded-lg font-medium transition-colors bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d] border border-[#30363d]"
      >
        {isLoggedIn ? 'Ir al dashboard' : 'Empezar gratis'}
      </Link>
    )
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
    >
      {loading ? 'Redirigiendo...' : `Empezar con ${planName}`}
    </button>
  )
}
