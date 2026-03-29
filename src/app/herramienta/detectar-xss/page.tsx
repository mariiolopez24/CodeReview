import Link from 'next/link'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Detector de XSS (Cross-Site Scripting) — CodeReview AI',
  description: 'Detecta vulnerabilidades XSS en tu código automáticamente. Análisis OWASP A03 con IA. Encuentra reflected, stored y DOM-based XSS.',
  keywords: ['xss detector', 'detectar xss', 'cross-site scripting scanner', 'vulnerabilidad xss', 'OWASP XSS'],
  openGraph: {
    title: 'Detector de XSS gratuito — CodeReview AI',
    description: 'Detecta Cross-Site Scripting en tu código en segundos. Powered by Claude AI.',
    type: 'website',
  },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Detector de XSS — CodeReview AI',
  url: 'https://www.codereview.codes/herramienta/detectar-xss',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function XssPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <Script id="schema-xss" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <nav className="border-b border-[#30363d] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-[#e6edf3] text-xl">
            CodeReview <span className="text-blue-400">AI</span>
          </Link>
          <Link href="/signup" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
            Probar gratis →
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-900/30 border border-orange-700/50 text-orange-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            OWASP A03:2021 — Injection / XSS
          </div>
          <h1 className="text-4xl font-bold text-[#e6edf3] mb-4">
            Detector de XSS
          </h1>
          <p className="text-[#8b949e] text-lg max-w-2xl mx-auto">
            Cross-Site Scripting permite a atacantes inyectar scripts maliciosos en páginas web vistas por otros usuarios. Detecta XSS reflected, stored y DOM-based en tu código.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors">
              Analizar mi código gratis →
            </Link>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-4">Tipos de XSS</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { type: 'Reflected XSS', desc: 'El script malicioso viene en la request HTTP y se refleja inmediatamente en la respuesta.', icon: '↩️' },
              { type: 'Stored XSS', desc: 'El script se almacena en la base de datos y se ejecuta cuando otros usuarios ven el contenido.', icon: '💾' },
              { type: 'DOM-based XSS', desc: 'La vulnerabilidad está en el JavaScript del cliente que manipula el DOM con datos no sanitizados.', icon: '🌐' },
            ].map((t) => (
              <div key={t.type} className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
                <span className="text-2xl mb-3 block">{t.icon}</span>
                <h3 className="text-[#e6edf3] font-semibold mb-2">{t.type}</h3>
                <p className="text-[#8b949e] text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-6">Código vulnerable vs. seguro</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
              <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">Vulnerable (React)</p>
              <code className="text-red-300 text-sm font-mono whitespace-pre">{`// ⚠️ Inserta HTML sin escapar
<div dangerouslySetInnerHTML={{ __html: userInput }} />`}</code>
            </div>
            <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4">
              <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-3">Seguro (React)</p>
              <code className="text-green-300 text-sm font-mono whitespace-pre">{`// ✅ React escapa automáticamente
<div>{userInput}</div>`}</code>
            </div>
            <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
              <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">Vulnerable (JS)</p>
              <code className="text-red-300 text-sm font-mono whitespace-pre">{`element.innerHTML = req.query.name`}</code>
            </div>
            <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4">
              <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-3">Seguro (JS)</p>
              <code className="text-green-300 text-sm font-mono whitespace-pre">{`element.textContent = req.query.name`}</code>
            </div>
          </div>
        </section>

        <section className="text-center bg-[#161b22] border border-[#30363d] rounded-2xl p-10 mb-12">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-3">Detecta XSS en tu código ahora</h2>
          <p className="text-[#8b949e] mb-6">Análisis completo con IA en 15 segundos. 5 análisis gratis al mes.</p>
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors inline-block">
            Analizar ahora → Gratis
          </Link>
          <p className="text-xs text-[#484f58] mt-4">Sin tarjeta de crédito</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#8b949e] mb-4">Otras herramientas de seguridad</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/herramienta/detectar-sql-injection', label: 'Detector de SQL Injection' },
              { href: '/herramienta/detectar-csrf', label: 'Detector de CSRF' },
              { href: '/herramienta/detectar-inyeccion-comandos', label: 'Inyección de Comandos' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="bg-[#161b22] border border-[#30363d] text-sm text-[#8b949e] hover:text-[#e6edf3] px-4 py-2 rounded-lg transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
