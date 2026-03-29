'use client'

import { useState } from 'react'

interface Props {
  source?: string
  compact?: boolean
}

export default function NewsletterSignup({ source = 'site', compact = false }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
      } else {
        setErrorMsg(data.error ?? 'Error al suscribirse')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Error de conexión')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">✓</div>
        <p className="text-green-400 font-medium">¡Suscrito correctamente!</p>
        <p className="text-[#8b949e] text-sm mt-1">Te enviaremos los mejores tips de code review.</p>
      </div>
    )
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {status === 'loading' ? '...' : 'Suscribirse'}
        </button>
      </form>
    )
  }

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 text-center">
      <div className="text-2xl mb-3">📬</div>
      <h3 className="text-xl font-bold text-[#e6edf3] mb-2">
        Tips de code review cada semana
      </h3>
      <p className="text-[#8b949e] text-sm mb-6">
        Vulnerabilidades reales, buenas prácticas y trucos de seguridad.
        Sin spam. Cancela cuando quieras.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-sm mx-auto">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          {status === 'loading' ? '...' : 'Suscribir'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-3">{errorMsg}</p>
      )}
    </div>
  )
}
