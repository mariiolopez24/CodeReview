import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Precios — CodeReview AI',
  description: 'Plan gratuito con 5 reviews al mes. Plan Pro ilimitado por $12/mes o $96/año. 7 días de garantía de devolución.',
}

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <nav className="border-b border-[#30363d] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-[#e6edf3] text-xl">
            CodeReview <span className="text-blue-400">AI</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                Ir al dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">
                  Iniciar sesión
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  Empezar gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <PricingClient isLoggedIn={!!user} />
    </div>
  )
}
