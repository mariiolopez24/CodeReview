import Link from 'next/link'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Detector de CSRF — CodeReview AI',
  description: 'Detecta vulnerabilidades CSRF (Cross-Site Request Forgery) en tu código. Análisis OWASP con IA. Protege tus endpoints de ataques de falsificación de solicitudes.',
  keywords: ['csrf detector', 'detectar csrf', 'cross-site request forgery', 'csrf token', 'OWASP CSRF'],
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Detector de CSRF — CodeReview AI',
  url: 'https://www.codereview.codes/herramienta/detectar-csrf',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function CsrfPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <Script id="schema-csrf" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

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
          <div className="inline-flex items-center gap-2 bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            OWASP A01:2021 — Broken Access Control
          </div>
          <h1 className="text-4xl font-bold text-[#e6edf3] mb-4">
            Detector de CSRF
          </h1>
          <p className="text-[#8b949e] text-lg max-w-2xl mx-auto">
            CSRF (Cross-Site Request Forgery) engaña al navegador para que realice peticiones no autorizadas. Detecta endpoints sin protección CSRF en tu código.
          </p>
          <div className="flex justify-center mt-8">
            <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors">
              Analizar mi código gratis →
            </Link>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-4">¿Qué es CSRF?</h2>
          <p className="text-[#8b949e] mb-4">
            Un ataque CSRF induce a un usuario autenticado a ejecutar acciones no deseadas en una aplicación web. Por ejemplo, un enlace malicioso puede hacer que el navegador de la víctima envíe una petición para transferir dinero, cambiar email o borrar datos.
          </p>
          <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-5">
            <p className="text-yellow-400 font-semibold text-sm mb-2">Ejemplo de ataque:</p>
            <code className="text-yellow-300 text-sm font-mono block">
              {`<!-- En página del atacante -->`}<br />
              {`<img src="https://bank.com/transfer?to=attacker&amount=1000" />`}<br />
              <span className="text-yellow-500">{`→ El navegador envía la request con las cookies de sesión del usuario`}</span>
            </code>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-6">Cómo protegerse</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
              <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">Sin protección</p>
              <code className="text-red-300 text-sm font-mono whitespace-pre">{`@app.route('/transfer', methods=['POST'])
def transfer():
    amount = request.form['amount']
    # Sin verificación CSRF
    do_transfer(amount)`}</code>
            </div>
            <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4">
              <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-3">Con protección</p>
              <code className="text-green-300 text-sm font-mono whitespace-pre">{`@app.route('/transfer', methods=['POST'])
@csrf.protect  # Token CSRF validado
def transfer():
    amount = request.form['amount']
    do_transfer(amount)`}</code>
            </div>
          </div>
        </section>

        <section className="text-center bg-[#161b22] border border-[#30363d] rounded-2xl p-10 mb-12">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-3">¿Tus endpoints están protegidos?</h2>
          <p className="text-[#8b949e] mb-6">Descúbrelo con análisis de IA. 5 análisis gratis al mes.</p>
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors inline-block">
            Analizar ahora → Gratis
          </Link>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#8b949e] mb-4">Otras herramientas de seguridad</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/herramienta/detectar-sql-injection', label: 'Detector de SQL Injection' },
              { href: '/herramienta/detectar-xss', label: 'Detector de XSS' },
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
