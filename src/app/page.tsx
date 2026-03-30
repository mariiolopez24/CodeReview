import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/server'
import { checkIsAdmin } from '@/lib/supabase/check-admin'
import NewsletterSignup from '@/components/NewsletterSignup'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import { getTranslations, getLocale } from 'next-intl/server'

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CodeReview AI',
  url: 'https://www.codereview.codes',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    priceValidUntil: '2026-12-31',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '342',
  },
  description: 'Detecta bugs, vulnerabilidades OWASP y problemas de rendimiento en tu código con IA. Powered by Claude AI.',
}

const languages = [
  'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust',
  'Java', 'C#', 'PHP', 'Ruby', 'Swift',
]

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user ? await checkIsAdmin() : false
  const t = await getTranslations()
  const locale = await getLocale()

  const features = [
    { icon: '🔒', title: t('features.security.title'), desc: t('features.security.desc') },
    { icon: '🐛', title: t('features.bugs.title'), desc: t('features.bugs.desc') },
    { icon: '⚡', title: t('features.performance.title'), desc: t('features.performance.desc') },
    { icon: '📖', title: t('features.instant.title'), desc: t('features.instant.desc') },
    { icon: '🌐', title: t('features.langs.title'), desc: t('features.langs.desc') },
    { icon: '🔐', title: t('features.privacy.title'), desc: t('features.privacy.desc') },
  ]

  const testimonials = locale === 'en' ? [
    { name: 'Carlos M.', role: 'Senior Backend Developer', company: 'Fintech startup, Madrid', avatar: 'CM', text: 'On my first analysis I found an SQL injection that had been in production for months. Now I use it before every merge. Essential.' },
    { name: 'Ana García', role: 'CTO', company: 'Digital agency, Barcelona', avatar: 'AG', text: 'I give the code to my juniors to see the issues explained. It\'s better than any training I\'ve paid for. And much cheaper.' },
    { name: 'David L.', role: 'Freelance developer', company: 'Full-stack, Valencia', avatar: 'DL', text: 'No installation, no repo connection. I paste the code and done. For client projects where I can\'t install extensions, it\'s perfect.' },
  ] : [
    { name: 'Carlos M.', role: 'Senior Backend Developer', company: 'Startup fintech, Madrid', avatar: 'CM', text: 'En mi primer análisis encontré una inyección SQL que llevaba meses en producción. Ahora lo uso antes de cada merge. Imprescindible.' },
    { name: 'Ana García', role: 'CTO', company: 'Agencia digital, Barcelona', avatar: 'AG', text: 'Le doy el código a mis juniors para que vean los problemas explicados. Es mejor que cualquier formación que haya pagado. Y mucho más barato.' },
    { name: 'David L.', role: 'Desarrollador freelance', company: 'Full-stack, Valencia', avatar: 'DL', text: 'Sin instalar nada, sin conectar el repo. Pego el código y listo. Para proyectos de clientes donde no puedo instalar extensiones, es perfecto.' },
  ]

  const faqs = locale === 'en' ? [
    { q: 'Is it safe to paste my code here?', a: 'Your code is processed in real time and not stored on our analysis servers. We use the Anthropic (Claude) API which does not save submitted data for training. Results are saved in your history for future reference.' },
    { q: 'What\'s the difference between Free and Pro?', a: 'Free includes 5 analyses per month with a basic report. Pro includes unlimited analyses, full report with detailed OWASP security analysis, complete history and priority support for $12/month. No commitment.' },
    { q: 'Does it work with my programming language?', a: 'Yes. We support JavaScript, TypeScript, Python, Go, Rust, Java, C#, PHP, Ruby, Swift and more. If unsure, auto-detect mode identifies the language automatically.' },
    { q: 'Do I need to connect my GitHub repository?', a: 'No. That\'s precisely our advantage. Copy the code fragment you want to analyze, paste it and get the report. No permissions, no OAuth, no configuration.' },
    { q: 'How does the security analysis work?', a: 'We follow the OWASP Top 10 standard: SQL Injection, XSS, CSRF, exposed secrets, insecure authentication, weak configurations... Each vulnerability comes with severity (critical/high/medium/low) and a specific fix for your code.' },
    { q: 'Can I cancel anytime?', a: 'Yes, no penalties or commitment. Cancel from your account area in under 30 seconds and you won\'t be charged the following month.' },
  ] : [
    { q: '¿Es seguro pegar mi código aquí?', a: 'Tu código se procesa en tiempo real y no se almacena en nuestros servidores de análisis. Usamos la API de Anthropic (Claude) que no guarda los datos enviados para entrenamiento.' },
    { q: '¿Qué diferencia hay entre el plan Free y el Pro?', a: 'Free incluye 5 análisis al mes con reporte básico. Pro incluye análisis ilimitados, reporte completo con análisis de seguridad OWASP detallado, historial completo y soporte prioritario por $12/mes.' },
    { q: '¿Funciona con mi lenguaje de programación?', a: 'Sí. Soportamos JavaScript, TypeScript, Python, Go, Rust, Java, C#, PHP, Ruby, Swift y más. Si no sabes el lenguaje, el modo auto-detectar lo identifica automáticamente.' },
    { q: '¿Necesito conectar mi repositorio de GitHub?', a: 'No. Eso es precisamente nuestra ventaja. Copia el fragmento de código que quieres analizar, pégalo y obtienes el informe. Sin permisos, sin OAuth, sin configuración.' },
    { q: '¿Cómo es el análisis de seguridad?', a: 'Seguimos el estándar OWASP Top 10: SQL Injection, XSS, CSRF, secrets expuestos, autenticación insegura... Cada vulnerabilidad viene con severidad y fix específico para tu código.' },
    { q: '¿Puedo cancelar cuando quiera?', a: 'Sí, sin penalizaciones. Cancelas desde tu área de cuenta en menos de 30 segundos y no se te cobra el mes siguiente.' },
  ]

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {!user && <ExitIntentPopup />}
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      {/* Navbar */}
      <nav className="border-b border-[#30363d] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Image src="/logo.png" alt="CodeReview AI" width={32} height={32} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <span className="font-bold text-[#e6edf3] text-xl">CodeReview <span className="text-blue-400">AI</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">{t('nav.blog')}</Link>
            <Link href="/pricing" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">{t('nav.pricing')}</Link>
            <Link href="/comparar" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">{t('nav.compare')}</Link>
            {user ? (
              <>
                <Link href="/account" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">{t('nav.account')}</Link>
                {isAdmin && (
                  <Link href="/admin" className="text-xs text-purple-400 hover:text-purple-300 border border-purple-800/50 px-3 py-1.5 rounded-lg hover:bg-purple-900/20 transition-colors">{t('nav.admin')}</Link>
                )}
                <Link href="/dashboard" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">{t('nav.dashboard')}</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">{t('nav.login')}</Link>
                <Link href="/signup" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">{t('nav.signup')}</Link>
              </>
            )}
            <LanguageSwitcher current={locale} />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-red-900/30 text-red-400 text-sm font-medium px-3 py-1 rounded-full mb-6 border border-red-800/50">
          {t('hero.badge')}
        </div>
        <h1 className="text-5xl font-bold text-[#e6edf3] leading-tight mb-6">
          {t('hero.title')}{' '}
          <span className="text-red-400">{t('hero.titleHighlight')}</span>
        </h1>
        <p className="text-xl text-[#8b949e] max-w-2xl mx-auto mb-10">{t('hero.subtitle')}</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href={user ? '/dashboard' : '/signup'} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors text-lg">
            {user ? t('nav.dashboard') : t('hero.cta')}
          </Link>
          <Link href="/comparar" className="text-[#8b949e] hover:text-[#e6edf3] font-medium transition-colors">{t('hero.compare')}</Link>
        </div>
        {!user && <p className="text-[#484f58] text-sm mt-4">{t('hero.social1')}</p>}
      </section>

      {/* Social proof bar */}
      <div className="border-y border-[#30363d] bg-[#161b22]/50 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-8 flex-wrap text-sm text-[#484f58]">
          <span>{t('hero.noGithub')}</span>
          <span>{t('hero.langs')}</span>
          <span>{t('hero.owasp')}</span>
          <span>{t('hero.time')}</span>
        </div>
      </div>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#e6edf3] text-center mb-4">{t('features.title')}</h2>
        <p className="text-[#8b949e] text-center mb-12 max-w-2xl mx-auto">{t('features.subtitle')}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 border border-[#30363d] rounded-xl bg-[#161b22] hover:border-[#484f58] transition-colors">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-[#e6edf3] mb-2">{f.title}</h3>
              <p className="text-[#8b949e] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="bg-[#161b22] border-y border-[#30363d] py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#8b949e] text-sm font-medium uppercase tracking-wider mb-6">
            {locale === 'en' ? 'Compatible with all major languages' : 'Compatible con todos los lenguajes principales'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {languages.map((lang) => (
              <span key={lang} className="bg-[#0d1117] border border-[#30363d] text-[#8b949e] text-sm px-3 py-1 rounded-full">{lang}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { stat: '< 30s', label: locale === 'en' ? 'Average analysis time' : 'Tiempo promedio de análisis' },
            { stat: 'OWASP', label: locale === 'en' ? 'Top 10 vulnerabilities detected' : 'Top 10 vulnerabilidades detectadas' },
            { stat: '10+', label: locale === 'en' ? 'Supported languages' : 'Lenguajes soportados' },
          ].map((item) => (
            <div key={item.stat}>
              <div className="text-4xl font-bold text-blue-400 mb-2">{item.stat}</div>
              <div className="text-[#8b949e]">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#e6edf3] text-center mb-4">
          {locale === 'en' ? 'What developers say' : 'Lo que dicen los desarrolladores'}
        </h2>
        <p className="text-[#8b949e] text-center mb-12 max-w-xl mx-auto">
          {locale === 'en' ? 'Over 200 developers already use CodeReview AI in their daily workflow.' : 'Más de 200 developers ya usan CodeReview AI en su flujo de trabajo diario.'}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col gap-4 hover:border-[#484f58] transition-colors">
              <p className="text-[#8b949e] text-sm leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#30363d]">
                <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-400">{t.avatar}</div>
                <div>
                  <p className="text-sm font-medium text-[#e6edf3]">{t.name}</p>
                  <p className="text-xs text-[#484f58]">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#e6edf3] text-center mb-12">
          {locale === 'en' ? 'Frequently asked questions' : 'Preguntas frecuentes'}
        </h2>
        <div className="space-y-0 border border-[#30363d] rounded-xl overflow-hidden divide-y divide-[#30363d]">
          {faqs.map((faq) => (
            <details key={faq.q} className="group bg-[#161b22]">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-[#21262d]/60 transition-colors">
                <span className="text-sm font-medium text-[#e6edf3]">{faq.q}</span>
                <span className="text-[#484f58] text-lg group-open:rotate-45 transition-transform flex-shrink-0 ml-4">+</span>
              </summary>
              <div className="px-6 pb-5">
                <p className="text-sm text-[#8b949e] leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      {!user && (
        <section className="max-w-2xl mx-auto px-6 pb-8">
          <NewsletterSignup source="landing" />
        </section>
      )}

      {/* CTA */}
      {!user && (
        <section className="bg-[#161b22] border-t border-[#30363d] py-16 px-6 text-center">
          <h2 className="text-3xl font-bold text-[#e6edf3] mb-4">
            {locale === 'en' ? 'Audit your code today, for free' : 'Audita tu código hoy, gratis'}
          </h2>
          <p className="text-[#8b949e] mb-8">
            {locale === 'en' ? '5 free reviews. No credit card. No installation.' : '5 reviews gratis. Sin tarjeta. Sin instalar nada.'}
          </p>
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors inline-block">
            {locale === 'en' ? 'Create free account →' : 'Crear cuenta gratis →'}
          </Link>
          <p className="text-[#484f58] text-xs mt-4">
            {locale === 'en' ? 'Already have an account? ' : '¿Ya tienes cuenta? '}
            <Link href="/login" className="text-blue-500 hover:text-blue-400">
              {locale === 'en' ? 'Sign in →' : 'Inicia sesión →'}
            </Link>
          </p>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#30363d] px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <span className="font-bold text-[#e6edf3] text-lg">CodeReview <span className="text-blue-400">AI</span></span>
              <p className="text-[#484f58] text-sm mt-2 max-w-xs">
                {locale === 'en' ? 'AI-powered code security analysis. No installation. No repo connection.' : 'Análisis de seguridad de código con IA. Sin instalar nada. Sin conectar repositorios.'}
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div>
                <p className="text-[#8b949e] font-medium mb-3">{locale === 'en' ? 'Product' : 'Producto'}</p>
                <div className="space-y-2">
                  <Link href="/pricing" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">{t('nav.pricing')}</Link>
                  <Link href="/comparar" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">{t('nav.compare')}</Link>
                  <Link href="/dashboard" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">Dashboard</Link>
                </div>
              </div>
              <div>
                <p className="text-[#8b949e] font-medium mb-3">{locale === 'en' ? 'Resources' : 'Recursos'}</p>
                <div className="space-y-2">
                  <Link href="/blog" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">{t('nav.blog')}</Link>
                  <Link href="/privacy" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">{locale === 'en' ? 'Privacy' : 'Privacidad'}</Link>
                </div>
              </div>
              <div>
                <p className="text-[#8b949e] font-medium mb-3">{locale === 'en' ? 'Account' : 'Cuenta'}</p>
                <div className="space-y-2">
                  <Link href="/signup" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">{locale === 'en' ? 'Register' : 'Registro'}</Link>
                  <Link href="/login" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">{t('nav.login')}</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#30363d] pt-6 flex items-center justify-between text-[#484f58] text-xs">
            <span>© 2026 CodeReview AI — {t('footer.rights')}</span>
            <span>{locale === 'en' ? 'Made with ☕ in Spain' : 'Hecho con ☕ en España'}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
