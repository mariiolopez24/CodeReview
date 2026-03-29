'use client'

import { useState } from 'react'
import Link from 'next/link'

const PLANS = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    features: [
      '5 análisis por mes',
      'Lenguajes principales',
      'Detección de bugs básica',
      'Análisis de seguridad básico',
    ],
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 12,
    annualPrice: 8,
    features: [
      'Análisis ilimitados',
      'Todos los lenguajes',
      'OWASP Top 10 completo',
      'Historial de análisis',
      'Soporte prioritario',
      'Respuestas en tu idioma',
    ],
    popular: true,
  },
  team: {
    name: 'Team',
    monthlyPrice: 39,
    annualPrice: 29,
    features: [
      'Todo lo de Pro',
      'Hasta 5 usuarios',
      'Dashboard compartido',
      'API access',
      'Onboarding dedicado',
      'SLA garantizado',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: null,
    features: [
      'Usuarios ilimitados',
      'Instancia privada',
      'SSO / SAML',
      'Auditoría y compliance',
      'SLA 99.9%',
      'Soporte dedicado 24/7',
    ],
  },
}

interface Props {
  isLoggedIn: boolean
}

export default function PricingClient({ isLoggedIn }: Props) {
  const [annual, setAnnual] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  async function handleUpgrade(planKey: string) {
    setLoadingPlan(planKey)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey, annual }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else if (res.status === 401) {
      window.location.href = '/login?redirect=/pricing'
    }
    setLoadingPlan(null)
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-bold text-[#e6edf3] mb-3">Precios simples y transparentes</h1>
      <p className="text-[#8b949e] mb-8">Sin sorpresas. Cancela cuando quieras.</p>

      {/* Annual toggle */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <span className={`text-sm ${!annual ? 'text-[#e6edf3]' : 'text-[#484f58]'}`}>Mensual</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-blue-600' : 'bg-[#30363d]'}`}
        >
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${annual ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
        <span className={`text-sm ${annual ? 'text-[#e6edf3]' : 'text-[#484f58]'}`}>
          Anual{' '}
          <span className="bg-green-900/50 text-green-400 text-xs font-medium px-2 py-0.5 rounded-full">
            Ahorra 33%
          </span>
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Free */}
        <div className="border border-[#30363d] rounded-xl p-7 text-left bg-[#161b22]">
          <h2 className="text-lg font-bold text-[#e6edf3] mb-1">{PLANS.free.name}</h2>
          <div className="mb-5">
            <span className="text-3xl font-bold text-[#e6edf3]">$0</span>
            <span className="text-[#8b949e] ml-1 text-sm">/ siempre gratis</span>
          </div>
          <ul className="space-y-2.5 mb-7">
            {PLANS.free.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-green-400 mt-0.5 shrink-0">✓</span>{f}
              </li>
            ))}
          </ul>
          <Link
            href={isLoggedIn ? '/dashboard' : '/signup'}
            className="w-full block text-center py-2 rounded-lg font-medium transition-colors bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d] border border-[#30363d] text-sm"
          >
            {isLoggedIn ? 'Ir al dashboard' : 'Empezar gratis'}
          </Link>
        </div>

        {/* Pro */}
        <div className="border-2 border-blue-500 rounded-xl p-7 text-left bg-[#161b22] ring-2 ring-blue-500/20 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Más popular
          </div>
          <h2 className="text-lg font-bold text-[#e6edf3] mb-1">{PLANS.pro.name}</h2>
          <div className="mb-5">
            <span className="text-3xl font-bold text-[#e6edf3]">
              ${annual ? PLANS.pro.annualPrice : PLANS.pro.monthlyPrice}
            </span>
            <span className="text-[#8b949e] ml-1 text-sm">/ mes{annual ? ', facturado anual' : ''}</span>
            {annual && (
              <p className="text-xs text-green-400 mt-1">= ${(PLANS.pro.annualPrice! * 12)} al año (ahorras $48)</p>
            )}
          </div>
          <ul className="space-y-2.5 mb-7">
            {PLANS.pro.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-green-400 mt-0.5 shrink-0">✓</span>{f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleUpgrade('pro')}
            disabled={loadingPlan === 'pro'}
            className="w-full py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 text-sm"
          >
            {loadingPlan === 'pro' ? 'Redirigiendo...' : 'Empezar con Pro'}
          </button>
        </div>

        {/* Team */}
        <div className="border border-[#30363d] rounded-xl p-7 text-left bg-[#161b22]">
          <h2 className="text-lg font-bold text-[#e6edf3] mb-1">{PLANS.team.name}</h2>
          <div className="mb-5">
            <span className="text-3xl font-bold text-[#e6edf3]">
              ${annual ? PLANS.team.annualPrice : PLANS.team.monthlyPrice}
            </span>
            <span className="text-[#8b949e] ml-1 text-sm">/ mes{annual ? ', facturado anual' : ''}</span>
            {annual && (
              <p className="text-xs text-green-400 mt-1">= ${(PLANS.team.annualPrice! * 12)} al año (ahorras $120)</p>
            )}
          </div>
          <ul className="space-y-2.5 mb-7">
            {PLANS.team.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-green-400 mt-0.5 shrink-0">✓</span>{f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleUpgrade('team')}
            disabled={loadingPlan === 'team'}
            className="w-full py-2 rounded-lg font-medium transition-colors bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d] border border-[#30363d] disabled:opacity-50 text-sm"
          >
            {loadingPlan === 'team' ? 'Redirigiendo...' : 'Empezar con Team'}
          </button>
        </div>

        {/* Enterprise */}
        <div className="border border-[#30363d] rounded-xl p-7 text-left bg-[#161b22]">
          <h2 className="text-lg font-bold text-[#e6edf3] mb-1">{PLANS.enterprise.name}</h2>
          <div className="mb-5">
            <span className="text-3xl font-bold text-[#e6edf3]">Custom</span>
            <span className="text-[#8b949e] ml-1 text-sm">/ precio a medida</span>
          </div>
          <ul className="space-y-2.5 mb-7">
            {PLANS.enterprise.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-purple-400 mt-0.5 shrink-0">✓</span>{f}
              </li>
            ))}
          </ul>
          <a
            href="mailto:hola@codereview.codes?subject=Enterprise"
            className="w-full block text-center py-2 rounded-lg font-medium transition-colors bg-purple-900/40 text-purple-300 hover:bg-purple-900/60 border border-purple-700/50 text-sm"
          >
            Contactar ventas
          </a>
        </div>
      </div>

      {/* Guarantee */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#8b949e]">
        <div className="flex items-center gap-2">
          <span className="text-green-400">🛡️</span>
          <span>7 días de garantía de devolución</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-400">🔒</span>
          <span>Tu código nunca se almacena</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">⚡</span>
          <span>Cancela en cualquier momento</span>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-2xl mx-auto text-left space-y-4">
        <h2 className="text-xl font-bold text-[#e6edf3] mb-6 text-center">Preguntas frecuentes</h2>
        {[
          {
            q: '¿Qué pasa cuando acabo mis 5 análisis gratuitos?',
            a: 'Puedes seguir usando la plataforma pero no podrás hacer nuevos análisis hasta el mes siguiente o hasta que te actualices a Pro.',
          },
          {
            q: '¿Se almacena mi código?',
            a: 'No. Tu código se envía a la IA para análisis pero no lo guardamos en ninguna base de datos.',
          },
          {
            q: '¿Puedo cancelar en cualquier momento?',
            a: 'Sí, sin penalizaciones. Puedes cancelar desde tu cuenta con un clic.',
          },
          {
            q: '¿Qué lenguajes soportáis?',
            a: 'JavaScript, TypeScript, Python, Go, Rust, Java, C#, PHP, Ruby, Swift y cualquier otro que Claude AI pueda analizar (la detección es automática).',
          },
        ].map((faq) => (
          <div key={faq.q} className="border border-[#30363d] rounded-lg p-5 bg-[#161b22]">
            <p className="text-sm font-semibold text-[#e6edf3] mb-2">{faq.q}</p>
            <p className="text-sm text-[#8b949e]">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
