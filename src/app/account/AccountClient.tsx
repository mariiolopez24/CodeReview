'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLANS } from '@/types'

interface Props {
  email: string
  plan: string
  reviewsUsed: number
  stripeCustomerId: string | null
}

export default function AccountClient({ email, plan, reviewsUsed, stripeCustomerId }: Props) {
  const router = useRouter()
  const planInfo = PLANS[plan as keyof typeof PLANS]
  const reviewsLimit = plan === 'free' ? 10 : -1

  // Password change state
  const [pwSection, setPwSection] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  // Delete account state
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPw !== confirmPw) { setPwError('Las contraseñas no coinciden'); return }
    if (newPw.length < 6) { setPwError('Mínimo 6 caracteres'); return }
    setPwLoading(true)
    setPwError('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPw })

    if (error) {
      setPwError(error.message)
    } else {
      setPwSuccess(true)
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setTimeout(() => { setPwSuccess(false); setPwSection(false) }, 2000)
    }
    setPwLoading(false)
  }

  async function handleManageBilling() {
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true)
    const res = await fetch('/api/account/delete', { method: 'DELETE' })
    if (res.ok) {
      router.push('/')
      router.refresh()
    }
    setDeleteLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {/* Header */}
      <header className="bg-[#161b22] border-b border-[#30363d] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-[#e6edf3] text-xl hover:text-white transition-colors">
            CodeReview <span className="text-blue-400">AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">
              ← Dashboard
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-xs text-[#8b949e] hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-900/20"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-[#e6edf3]">Mi cuenta</h1>

        {/* Account info */}
        <section className="bg-[#161b22] border border-[#30363d] rounded-xl divide-y divide-[#30363d]">
          <div className="px-6 py-4">
            <h2 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider">Información de cuenta</h2>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#484f58] mb-1">Email</p>
              <p className="text-[#e6edf3] text-sm">{email}</p>
            </div>
          </div>
          <div className="px-6 py-4">
            {!pwSection ? (
              <button
                onClick={() => setPwSection(true)}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Cambiar contraseña →
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
                <p className="text-sm font-medium text-[#e6edf3]">Cambiar contraseña</p>
                {pwError && (
                  <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-xs p-2 rounded-lg">{pwError}</div>
                )}
                {pwSuccess && (
                  <div className="bg-green-900/30 border border-green-700/50 text-green-400 text-xs p-2 rounded-lg">Contraseña actualizada ✓</div>
                )}
                <input
                  type="password"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="Nueva contraseña"
                  required
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Confirmar nueva contraseña"
                  required
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {pwLoading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPwSection(false); setPwError('') }}
                    className="text-sm text-[#8b949e] hover:text-[#e6edf3] px-3 py-2 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Subscription */}
        <section className="bg-[#161b22] border border-[#30363d] rounded-xl divide-y divide-[#30363d]">
          <div className="px-6 py-4">
            <h2 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider">Suscripción</h2>
          </div>
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-lg font-bold text-[#e6edf3] capitalize">{planInfo?.name ?? plan}</span>
                <span className="bg-blue-600/20 text-blue-400 text-xs font-medium px-2 py-0.5 rounded-full border border-blue-500/30">
                  Activo
                </span>
              </div>
              <p className="text-sm text-[#8b949e]">
                {plan === 'free'
                  ? `${reviewsUsed} / 5 reviews usados este mes`
                  : 'Reviews ilimitados · ' + (planInfo?.price ? `$${planInfo.price}/mes` : '')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#e6edf3]">
                ${planInfo?.price ?? 0}<span className="text-sm text-[#484f58] font-normal">{planInfo?.price ? '/mes' : ' gratis'}</span>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="px-6 py-4">
            <ul className="space-y-2">
              {planInfo?.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#8b949e]">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 flex items-center gap-3">
            {plan === 'free' ? (
              <Link
                href="/pricing"
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors font-medium"
              >
                Mejorar a Pro →
              </Link>
            ) : (
              <button
                onClick={handleManageBilling}
                className="bg-[#21262d] border border-[#30363d] text-[#e6edf3] text-sm px-4 py-2 rounded-lg hover:bg-[#30363d] transition-colors"
              >
                Gestionar facturación
              </button>
            )}
          </div>
        </section>

        {/* Usage */}
        {plan === 'free' && (
          <section className="bg-[#161b22] border border-[#30363d] rounded-xl divide-y divide-[#30363d]">
            <div className="px-6 py-4">
              <h2 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider">Uso este mes</h2>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#8b949e]">Reviews realizados</span>
                <span className="text-sm font-medium text-[#e6edf3]">{reviewsUsed} / 5</span>
              </div>
              <div className="w-full bg-[#21262d] rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${reviewsUsed >= 5 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(100, (reviewsUsed / 5) * 100)}%` }}
                />
              </div>
              {reviewsUsed >= 5 && (
                <p className="text-xs text-red-400 mt-2">Has alcanzado el límite mensual. <Link href="/pricing" className="underline">Hazte Pro para reviews ilimitados.</Link></p>
              )}
            </div>
          </section>
        )}

        {/* Danger zone */}
        <section className="bg-[#161b22] border border-red-900/40 rounded-xl divide-y divide-[#30363d]">
          <div className="px-6 py-4">
            <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Zona de peligro</h2>
          </div>
          <div className="px-6 py-5">
            {!deleteConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#e6edf3] font-medium">Eliminar cuenta</p>
                  <p className="text-xs text-[#484f58] mt-0.5">Esta acción es irreversible. Se borrarán todos tus datos.</p>
                </div>
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="text-sm text-red-400 border border-red-800/50 px-3 py-2 rounded-lg hover:bg-red-900/20 transition-colors"
                >
                  Eliminar cuenta
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-red-400 font-medium">¿Seguro? Esta acción no se puede deshacer.</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-500 disabled:opacity-50 transition-colors"
                  >
                    {deleteLoading ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="text-sm text-[#8b949e] hover:text-[#e6edf3] px-3 py-2 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
