'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type CookieChoice = 'accepted' | 'rejected' | 'custom' | null

interface CookiePrefs {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

const DEFAULT_PREFS: CookiePrefs = {
  necessary: true, // always on
  analytics: false,
  marketing: false,
}

export default function CookieBanner() {
  const [choice, setChoice] = useState<CookieChoice>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [prefs, setPrefs] = useState<CookiePrefs>(DEFAULT_PREFS)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('cookie_consent')
    if (!saved) {
      // Small delay so it doesn't flash immediately on load
      setTimeout(() => setVisible(true), 800)
    }
  }, [])

  function saveChoice(c: CookieChoice, customPrefs?: CookiePrefs) {
    const finalPrefs = customPrefs ?? (c === 'accepted'
      ? { necessary: true, analytics: true, marketing: true }
      : { necessary: true, analytics: false, marketing: false })

    localStorage.setItem('cookie_consent', c!)
    localStorage.setItem('cookie_prefs', JSON.stringify(finalPrefs))

    // Set a cookie so server can read the consent
    document.cookie = `cookie_consent=${c}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`

    setChoice(c)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ height: '20vh', minHeight: '180px' }}>
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-[#0d1117]/95 backdrop-blur-sm border-t border-[#30363d]" />

      <div className="relative h-full max-w-6xl mx-auto px-6 flex items-center">
        {!showConfig ? (
          /* Main banner */
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[#e6edf3] font-semibold text-base mb-1">
                🍪 Usamos cookies
              </p>
              <p className="text-[#8b949e] text-sm leading-relaxed">
                Utilizamos cookies propias y de terceros para el funcionamiento del servicio, análisis de uso y mejora de la experiencia.
                Puedes aceptarlas, rechazarlas o{' '}
                <button
                  onClick={() => setShowConfig(true)}
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                >
                  configurarlas
                </button>
                . Más info en nuestra{' '}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
                  política de privacidad
                </Link>
                .
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => saveChoice('rejected')}
                className="px-4 py-2 text-sm text-[#8b949e] border border-[#30363d] rounded-lg hover:border-[#484f58] hover:text-[#e6edf3] transition-colors bg-[#161b22]"
              >
                Rechazar
              </button>
              <button
                onClick={() => setShowConfig(true)}
                className="px-4 py-2 text-sm text-[#e6edf3] border border-[#30363d] rounded-lg hover:border-[#484f58] transition-colors bg-[#21262d]"
              >
                Configurar
              </button>
              <button
                onClick={() => saveChoice('accepted')}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors font-medium"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        ) : (
          /* Config panel */
          <div className="w-full flex flex-col sm:flex-row items-start gap-6 justify-between">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Necessary */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-9 h-5 bg-blue-600 rounded-full flex-shrink-0 relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                </div>
                <div>
                  <p className="text-[#e6edf3] text-sm font-medium">Necesarias</p>
                  <p className="text-[#484f58] text-xs">Siempre activas. Requeridas para el funcionamiento.</p>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                  className={`mt-0.5 w-9 h-5 rounded-full flex-shrink-0 relative transition-colors ${prefs.analytics ? 'bg-blue-600' : 'bg-[#30363d]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${prefs.analytics ? 'right-0.5' : 'left-0.5'}`} />
                </button>
                <div>
                  <p className="text-[#e6edf3] text-sm font-medium">Analíticas</p>
                  <p className="text-[#484f58] text-xs">Datos de uso para mejorar el servicio.</p>
                </div>
              </div>

              {/* Marketing */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                  className={`mt-0.5 w-9 h-5 rounded-full flex-shrink-0 relative transition-colors ${prefs.marketing ? 'bg-blue-600' : 'bg-[#30363d]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${prefs.marketing ? 'right-0.5' : 'left-0.5'}`} />
                </button>
                <div>
                  <p className="text-[#e6edf3] text-sm font-medium">Marketing</p>
                  <p className="text-[#484f58] text-xs">Personalización de contenido y anuncios.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setShowConfig(false)}
                className="px-3 py-2 text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors"
              >
                ← Volver
              </button>
              <button
                onClick={() => saveChoice('custom', prefs)}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors font-medium"
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
