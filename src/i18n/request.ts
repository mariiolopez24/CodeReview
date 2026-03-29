import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

const LOCALES = ['es', 'en'] as const
const DEFAULT_LOCALE = 'es'

export function detectLocale(): string {
  return DEFAULT_LOCALE
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const headerStore = await headers()

  let locale = cookieStore.get('NEXT_LOCALE')?.value

  if (!locale || !LOCALES.includes(locale as 'es' | 'en')) {
    const acceptLanguage = headerStore.get('accept-language') ?? ''
    const browserLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase()
    locale = LOCALES.includes(browserLang as 'es' | 'en') ? browserLang : DEFAULT_LOCALE
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
