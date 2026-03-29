'use client'

import Link from 'next/link'

interface Props {
  plan: string
  reviewsLeft: number | string
  email: string
  isAdmin?: boolean
}

export default function DashboardNav({ plan, reviewsLeft, email, isAdmin }: Props) {
  return (
    <header className="bg-[#161b22] border-b border-[#30363d] px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo — vuelve al inicio */}
        <Link href="/" className="font-bold text-[#e6edf3] text-xl hover:text-white transition-colors">
          CodeReview <span className="text-blue-400">AI</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-[#8b949e]">
            Reviews restantes:{' '}
            <span className={`font-semibold ${reviewsLeft === 0 ? 'text-red-400' : 'text-[#e6edf3]'}`}>
              {reviewsLeft}
            </span>
          </span>

          <span className="bg-[#21262d] border border-[#30363d] text-[#8b949e] text-xs font-medium px-2 py-1 rounded-full capitalize">
            {plan}
          </span>

          {plan === 'free' && (
            <Link
              href="/pricing"
              className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-500 transition-colors"
            >
              Upgrade a Pro →
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs text-purple-400 hover:text-purple-300 border border-purple-800/50 px-3 py-1.5 rounded-lg hover:bg-purple-900/20 transition-colors"
            >
              Admin
            </Link>
          )}

          {/* User menu */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#30363d]">
            <Link
              href="/account"
              className="text-xs text-[#484f58] hover:text-[#8b949e] hidden sm:block max-w-[140px] truncate transition-colors"
              title="Mi cuenta"
            >
              {email}
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
      </div>
    </header>
  )
}
