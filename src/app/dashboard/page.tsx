import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'
import DashboardTabs from '@/components/DashboardTabs'
import AdBanner from '@/components/AdBanner'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import { checkIsAdmin } from '@/lib/supabase/check-admin'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const reviewsLimit = profile?.plan === 'free' ? 5 : -1
  const reviewsLeft = reviewsLimit === -1 ? '∞' : Math.max(0, reviewsLimit - (profile?.reviews_used ?? 0))
  const isAdmin = await checkIsAdmin()
  const locale = await getLocale()
  const t = await getTranslations()

  const { data: recentReviews } = await supabase
    .from('reviews')
    .select('id, language, result, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {(profile?.plan ?? 'free') === 'free' && <ExitIntentPopup />}
      <DashboardNav
        plan={profile?.plan ?? 'free'}
        reviewsLeft={reviewsLeft}
        email={user.email ?? ''}
        isAdmin={isAdmin}
        locale={locale}
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {(profile?.plan ?? 'free') === 'free' && (
          <div className="mb-6 bg-gradient-to-r from-blue-900/40 to-purple-900/30 border border-blue-500/30 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#e6edf3]">
                Estás en el plan gratuito — {typeof reviewsLeft === 'number' ? reviewsLeft : '∞'} análisis restantes este mes
              </p>
              <p className="text-xs text-[#8b949e] mt-0.5">
                Pro: análisis ilimitados, sin anuncios, código corregido completo · desde $12/mes
              </p>
            </div>
            <a
              href="/pricing"
              className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Ver planes →
            </a>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#e6edf3]">{t('dashboard.title')}</h1>
          <p className="text-[#8b949e] mt-1">{t('dashboard.subtitle')}</p>
        </div>

        <DashboardTabs
          plan={profile?.plan ?? 'free'}
          reviewsUsed={profile?.reviews_used ?? 0}
          reviewsLimit={reviewsLimit}
          recentReviews={recentReviews ?? []}
        />

        {(profile?.plan ?? 'free') === 'free' && (
          <div className="mt-8 space-y-3">
            <AdBanner
              slot="4341195177"
              format="horizontal"
              className="border border-[#30363d] rounded-xl p-3 bg-[#161b22]"
            />
            <p className="text-center text-xs text-[#484f58]">
              ¿Cansado de los anuncios?{' '}
              <a href="/pricing" className="text-blue-400 hover:text-blue-300">
                Hazte Pro y elimínalos →
              </a>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
