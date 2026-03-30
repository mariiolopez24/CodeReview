'use client'

import { useState, useEffect, useRef } from 'react'

const POPUP_KEY = 'codereview_exit_popup'
const OFFER_KEY = 'codereview_exit_offer_ts'
const COOLDOWN_DAYS = 7

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const shownRef = useRef(false)

  useEffect(() => {
    // Check cooldown
    const lastShown = localStorage.getItem(POPUP_KEY)
    if (lastShown) {
      const diff = Date.now() - parseInt(lastShown)
      if (diff < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) return
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !shownRef.current) {
        shownRef.current = true
        localStorage.setItem(POPUP_KEY, Date.now().toString())

        // Set or restore 24h countdown
        let offerTs = parseInt(localStorage.getItem(OFFER_KEY) || '0')
        if (!offerTs) {
          offerTs = Date.now() + 24 * 60 * 60 * 1000
          localStorage.setItem(OFFER_KEY, offerTs.toString())
        }

        const remaining = Math.max(0, Math.floor((offerTs - Date.now()) / 1000))
        setSecondsLeft(remaining)
        setShow(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  useEffect(() => {
    if (!show || secondsLeft <= 0) return
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [show])

  function formatTime(s: number) {
    const h = Math.floor(s / 3600).toString().padStart(2, '0')
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-[#484f58] hover:text-[#8b949e] transition-colors text-xl leading-none"
        >
          ×
        </button>

        <div className="text-center">
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-2">
            Espera — oferta exclusiva
          </h2>
          <p className="text-[#8b949e] text-sm mb-6 leading-relaxed">
            Antes de irte, consigue <span className="text-white font-semibold">2 meses de Pro gratis</span> con el código:
          </p>

          <div className="bg-[#0d1117] border border-blue-500/50 rounded-xl px-6 py-3 mb-4 inline-block">
            <span className="text-blue-400 font-mono font-bold text-2xl tracking-widest">EXIT40</span>
          </div>

          <p className="text-xs text-[#484f58] mb-6">
            Esta oferta expira en:
          </p>

          {secondsLeft > 0 ? (
            <div className="bg-[#0d1117] rounded-xl px-6 py-3 mb-6 inline-block border border-[#30363d]">
              <span className="text-red-400 font-mono font-bold text-3xl tracking-widest">
                {formatTime(secondsLeft)}
              </span>
            </div>
          ) : (
            <div className="bg-[#0d1117] rounded-xl px-6 py-3 mb-6 inline-block border border-[#30363d]">
              <span className="text-red-400 font-mono font-bold text-lg">Oferta expirada</span>
            </div>
          )}

          <div className="space-y-3">
            <a
              href="/pricing"
              onClick={() => setShow(false)}
              className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors text-sm"
            >
              Reclamar oferta → Ver planes
            </a>
            <button
              onClick={() => setShow(false)}
              className="block w-full text-[#484f58] text-xs hover:text-[#8b949e] transition-colors py-1"
            >
              No, prefiero pagar precio completo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
