import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://codereview-ai.com'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'CodeReview AI — AI-powered Code Review in seconds',
    template: '%s — CodeReview AI',
  },
  description:
    'Paste your code and get a complete analysis: bugs, OWASP security, performance and best practices. Powered by Claude AI. Free to start.',
  keywords: [
    'code review ai', 'ai code review', 'code review tool',
    'owasp vulnerability scanner', 'automated code review', 'security code analysis',
    'revisión de código ia', 'análisis de código automático',
  ],
  authors: [{ name: 'CodeReview AI' }],
  creator: 'CodeReview AI',
  openGraph: {
    title: 'CodeReview AI — AI-powered Code Review',
    description: 'Detect bugs, OWASP vulnerabilities and performance issues in seconds. No installation needed.',
    type: 'website',
    url: APP_URL,
    siteName: 'CodeReview AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeReview AI — AI-powered Code Review',
    description: 'Detect bugs, OWASP vulnerabilities and performance issues in seconds.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1 },
  },
  verification: {
    google: 'google8f5fc260f78f8a75',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
