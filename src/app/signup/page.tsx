'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // If email confirmation is required, show message instead of redirecting
    if (signUpData.user && !signUpData.session) {
      setError('Revisa tu email y confirma tu cuenta antes de entrar. O desactiva "Confirm email" en Supabase → Authentication → Providers → Email.')
      setLoading(false)
      return
    }

    // No confirmation needed — login directly
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setError('Cuenta creada. Intenta iniciar sesión manualmente.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 w-full max-w-sm">
        <Link href="/" className="block text-center font-bold text-[#e6edf3] text-xl mb-8">
          CodeReview <span className="text-blue-400">AI</span>
        </Link>

        <h1 className="text-2xl font-bold text-[#e6edf3] mb-2">Crear cuenta gratis</h1>
        <p className="text-[#8b949e] text-sm mb-6">5 reviews gratis · Sin tarjeta de crédito</p>

        {error && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm p-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium text-[#8b949e] mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis →'}
          </button>
        </form>

        <p className="text-center text-xs text-[#484f58] mt-4">
          Al registrarte aceptas nuestra{' '}
          <Link href="/privacy" className="text-[#8b949e] hover:text-blue-400 transition-colors">
            política de privacidad
          </Link>{' '}
          y el{' '}
          <Link href="/privacy" className="text-[#8b949e] hover:text-blue-400 transition-colors">
            tratamiento de datos
          </Link>
        </p>

        <p className="text-center text-sm text-[#8b949e] mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
