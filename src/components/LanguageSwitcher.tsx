'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

const LOCALES = [
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
]

export default function LanguageSwitcher({ current }: { current: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchLocale(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;samesite=lax`
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          disabled={isPending}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            current === code
              ? 'bg-[#30363d] text-[#e6edf3] font-medium'
              : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]'
          }`}
          title={flag}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
