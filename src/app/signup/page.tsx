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

    if (signUpData.user && !signUpData.session) {
      setError('Revisa tu email y confirma tu cuenta antes de entrar.')
      setLoading(false)
      return
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setError('Cuenta creada. Intenta iniciar sesión manualmente.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  async function handleGitHub() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard` },
    })
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex">
      {/* Left: value proposition */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-[#161b22] border-r border-[#30363d] w-[420px] shrink-0">
        <Link href="/" className="flex items-center gap-2 mb-12 hover:opacity-90 transition-opacity">
          <img src="/logo.png" alt="CodeReview AI" width={36} height={36} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <span className="font-bold text-[#e6edf3] text-xl">CodeReview <span className="text-blue-400">AI</span></span>
        </Link>
        <h2 className="text-2xl font-bold text-[#e6edf3] mb-3 leading-tight">
          Empieza gratis.<br />Sin tarjeta de crédito.
        </h2>
        <p className="text-[#8b949e] text-sm mb-10 leading-relaxed">
          Únete a más de 2.000 desarrolladores que ya revisan su código con IA.
        </p>
        <ul className="space-y-4">
          {[
            { icon: '✅', title: '5 análisis gratis al mes', desc: 'Sin límite de tiempo' },
            { icon: '🛡️', title: 'Detección OWASP Top 10', desc: 'SQL injection, XSS, CSRF y más' },
            { icon: '⚡', title: 'Resultados en segundos', desc: 'Powered by Claude AI' },
            { icon: '🌍', title: 'Respuestas en tu idioma', desc: 'Español, inglés y más' },
          ].map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <span className="text-xl mt-0.5">{item.icon}</span>
              <div>
                <p className="text-sm font-medium text-[#e6edf3]">{item.title}</p>
                <p className="text-xs text-[#484f58]">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 w-full max-w-sm lg:border-0 lg:bg-transparent lg:shadow-none">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8 lg:hidden hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="CodeReview AI" width={32} height={32} className="drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
            <span className="font-bold text-[#e6edf3] text-xl">CodeReview <span className="text-blue-400">AI</span></span>
          </Link>

          <h1 className="text-2xl font-bold text-[#e6edf3] mb-1">Crear cuenta gratis</h1>
          <p className="text-[#8b949e] text-sm mb-6">5 análisis gratis · Sin tarjeta de crédito</p>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm p-3 rounded-lg mb-4">{error}</div>
          )}

          {/* GitHub OAuth */}
          <button
            type="button"
            onClick={handleGitHub}
            className="w-full flex items-center justify-center gap-2 bg-[#21262d] border border-[#30363d] text-[#e6edf3] py-2 rounded-lg font-medium hover:bg-[#30363d] transition-colors text-sm mb-4"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continuar con GitHub
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#30363d]" />
            <span className="text-xs text-[#484f58]">o con email</span>
            <div className="flex-1 h-px bg-[#30363d]" />
          </div>

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
    </div>
  )
}
