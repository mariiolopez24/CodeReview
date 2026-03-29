'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError('No se pudo enviar el email. Comprueba la dirección.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 w-full max-w-sm">
        <Link href="/" className="block text-center font-bold text-[#e6edf3] text-xl mb-8">
          CodeReview <span className="text-blue-400">AI</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="text-4xl mb-4">📬</div>
            <h1 className="text-xl font-bold text-[#e6edf3] mb-2">Email enviado</h1>
            <p className="text-[#8b949e] text-sm mb-6">
              Si existe una cuenta con <strong className="text-[#e6edf3]">{email}</strong>,
              recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            </p>
            <p className="text-[#484f58] text-xs mb-6">Revisa también la carpeta de spam.</p>
            <Link
              href="/login"
              className="w-full block text-center bg-[#21262d] border border-[#30363d] text-[#e6edf3] py-2 rounded-lg font-medium hover:bg-[#30363d] transition-colors text-sm"
            >
              Volver al login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[#e6edf3] mb-2">Recuperar contraseña</h1>
            <p className="text-[#8b949e] text-sm mb-6">
              Escribe tu email y te enviaremos un enlace para crear una nueva contraseña.
            </p>

            {error && (
              <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8b949e] mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </form>

            <p className="text-center text-sm text-[#8b949e] mt-6">
              <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                ← Volver al login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
