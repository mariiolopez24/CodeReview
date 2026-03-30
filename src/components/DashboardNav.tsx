'use client'

import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslations } from 'next-intl'

interface Props {
  plan: string
  reviewsLeft: number | string
  email: string
  isAdmin?: boolean
  locale: string
}

export default function DashboardNav({ plan, reviewsLeft, email, isAdmin, locale }: Props) {
  const t = useTranslations()

  return (
    <header className="bg-[#161b22] border-b border-[#30363d] px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img src="/logo.png" alt="CodeReview AI" width={28} height={28} className="drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
          <span className="font-bold text-[#e6edf3] text-xl">CodeReview <span className="text-blue-400">AI</span></span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-[#8b949e]">
            {t('dashboard.reviewsLeft')}:{' '}
            <span className={`font-semibold ${reviewsLeft === 0 ? 'text-red-400' : 'text-[#e6edf3]'}`}>
              {reviewsLeft === -1 ? t('dashboard.unlimited') : reviewsLeft}
            </span>
          </span>

          <span className="bg-[#21262d] border border-[#30363d] text-[#8b949e] text-xs font-medium px-2 py-1 rounded-full capitalize">
            {t('dashboard.plan')}: {plan}
          </span>

          {plan === 'free' && (
            <Link href="/pricing" className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-500 transition-colors">
              {t('pricing.getStarted')} →
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin" className="text-xs text-purple-400 hover:text-purple-300 border border-purple-800/50 px-3 py-1.5 rounded-lg hover:bg-purple-900/20 transition-colors">
              {t('nav.admin')}
            </Link>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-[#30363d]">
            <Link href="/account" className="text-xs text-[#484f58] hover:text-[#8b949e] hidden sm:block max-w-[140px] truncate transition-colors" title={t('nav.account')}>
              {email}
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="text-xs text-[#8b949e] hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-900/20">
                {t('nav.logout')}
              </button>
            </form>
          </div>

          <LanguageSwitcher current={locale} />
        </div>
      </div>
    </header>
  )
}
