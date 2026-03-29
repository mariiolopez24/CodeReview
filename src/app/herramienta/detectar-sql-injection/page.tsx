import Link from 'next/link'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Detector de SQL Injection — CodeReview AI',
  description: 'Detecta vulnerabilidades de SQL Injection en tu código automáticamente. Análisis basado en OWASP Top 10 con IA. Gratis para empezar.',
  keywords: ['sql injection detector', 'detectar sql injection', 'sql injection scanner', 'vulnerabilidad sql injection', 'OWASP A03'],
  openGraph: {
    title: 'Detector de SQL Injection gratuito — CodeReview AI',
    description: 'Pega tu código y detecta SQL Injections en segundos. Powered by Claude AI.',
    type: 'website',
  },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Detector de SQL Injection — CodeReview AI',
  url: 'https://www.codereview.codes/herramienta/detectar-sql-injection',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const examples = [
  {
    bad: `cursor.execute("SELECT * FROM users WHERE id=" + user_id)`,
    good: `cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))`,
  },
  {
    bad: `query = f"SELECT * FROM products WHERE name='{name}'"`,
    good: `query = "SELECT * FROM products WHERE name = ?"`,
  },
]

export default function SqlInjectionPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <Script id="schema-sql" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

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
          <div className="inline-flex items-center gap-2 bg-red-900/30 border border-red-700/50 text-red-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            OWASP A03:2021 — Injection
          </div>
          <h1 className="text-4xl font-bold text-[#e6edf3] mb-4">
            Detector de SQL Injection
          </h1>
          <p className="text-[#8b949e] text-lg max-w-2xl mx-auto">
            SQL Injection es la vulnerabilidad #3 más crítica según OWASP. Detecta consultas SQL inseguras en tu código antes de que lleguen a producción.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors"
            >
              Analizar mi código gratis →
            </Link>
            <Link href="/dashboard" className="text-[#8b949e] text-sm hover:text-[#e6edf3] transition-colors">
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        {/* What is SQL Injection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-4">¿Qué es SQL Injection?</h2>
          <p className="text-[#8b949e] mb-4">
            SQL Injection ocurre cuando datos no validados de un usuario se insertan directamente en una consulta SQL, permitiendo al atacante manipular la base de datos: robar datos, modificarlos o eliminarlos.
          </p>
          <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-5">
            <p className="text-red-400 font-semibold text-sm mb-2">Ejemplo real de ataque:</p>
            <code className="text-red-300 text-sm font-mono">
              {`username = "admin' OR '1'='1"`}
              <br />
              {`query = "SELECT * FROM users WHERE username='" + username + "'"`}
              <br />
              <span className="text-red-500">{`→ devuelve TODOS los usuarios`}</span>
            </code>
          </div>
        </section>

        {/* Code examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-6">Código vulnerable vs. seguro</h2>
          <div className="space-y-6">
            {examples.map((ex, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
                  <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">Vulnerable</p>
                  <code className="text-red-300 text-sm font-mono">{ex.bad}</code>
                </div>
                <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4">
                  <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-3">Seguro</p>
                  <code className="text-green-300 text-sm font-mono">{ex.good}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How our tool works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-4">Cómo funciona nuestro detector</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { step: '1', title: 'Pega tu código', desc: 'Soportamos Python, JS, PHP, Java, Go, Ruby y más.' },
              { step: '2', title: 'Análisis IA', desc: 'Claude AI analiza el flujo de datos y detecta concatenaciones peligrosas.' },
              { step: '3', title: 'Fix inmediato', desc: 'Recibe el código corregido con parámetros preparados.' },
            ].map((item) => (
              <div key={item.step} className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="text-[#e6edf3] font-semibold mb-1">{item.title}</h3>
                <p className="text-[#8b949e] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-[#161b22] border border-[#30363d] rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-3">¿Tu código tiene SQL Injections?</h2>
          <p className="text-[#8b949e] mb-6">Descúbrelo en 15 segundos. Gratis para siempre en el plan Free.</p>
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors inline-block"
          >
            Analizar ahora → Gratis
          </Link>
          <p className="text-xs text-[#484f58] mt-4">Sin tarjeta de crédito · 5 análisis gratis al mes</p>
        </section>

        {/* Related tools */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-[#8b949e] mb-4">Otras herramientas de seguridad</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/herramienta/detectar-xss', label: 'Detector de XSS' },
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
