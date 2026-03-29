import Link from 'next/link'
import { PLANS } from '@/types'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import PricingButtons from './PricingButtons'

export const metadata: Metadata = {
  title: 'Precios — CodeReview AI',
  description: 'Plan gratuito con 5 reviews al mes. Plan Pro ilimitado por $12/mes. Sin permanencia.',
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

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-[#e6edf3] mb-4">Precios simples y transparentes</h1>
        <p className="text-[#8b949e] mb-16">Sin sorpresas. Cancela cuando quieras.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div
              key={key}
              className={`border rounded-xl p-8 text-left bg-[#161b22] ${
                key === 'pro'
                  ? 'border-blue-500 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-[#0d1117]'
                  : 'border-[#30363d]'
              }`}
            >
              {key === 'pro' && (
                <div className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full inline-block mb-4">
                  Más popular
                </div>
              )}
              <h2 className="text-xl font-bold text-[#e6edf3] mb-2">{plan.name}</h2>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#e6edf3]">${plan.price}</span>
                {plan.price > 0 && <span className="text-[#8b949e] ml-1">/mes</span>}
                {plan.price === 0 && <span className="text-[#8b949e] ml-1">gratis</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[#8b949e]">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <PricingButtons planKey={key} planName={plan.name} price={plan.price} isLoggedIn={!!user} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
