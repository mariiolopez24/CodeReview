import Link from 'next/link'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Detector de Inyección de Comandos (Command Injection) — CodeReview AI',
  description: 'Detecta vulnerabilidades de inyección de comandos del sistema operativo en tu código. Análisis OWASP A03 con IA. Protege tu servidor de ejecución arbitraria de comandos.',
  keywords: ['command injection detector', 'inyeccion comandos', 'os command injection', 'shell injection', 'OWASP command injection'],
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Detector de Inyección de Comandos — CodeReview AI',
  url: 'https://www.codereview.codes/herramienta/detectar-inyeccion-comandos',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function CommandInjectionPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <Script id="schema-cmd" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

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
            Detector de Inyección de Comandos
          </h1>
          <p className="text-[#8b949e] text-lg max-w-2xl mx-auto">
            Command Injection permite a un atacante ejecutar comandos arbitrarios en el servidor. Es una de las vulnerabilidades más críticas: puede comprometer completamente el sistema.
          </p>
          <div className="flex justify-center mt-8">
            <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors">
              Analizar mi código gratis →
            </Link>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-6">Código vulnerable vs. seguro</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
                <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">Vulnerable (Python)</p>
                <code className="text-red-300 text-sm font-mono whitespace-pre">{`import os
filename = request.args['file']
# ⚠️ Ejecuta comandos del usuario
os.system(f"cat {filename}")

# Ataque: file = "; rm -rf /"
`}</code>
              </div>
              <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4">
                <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-3">Seguro (Python)</p>
                <code className="text-green-300 text-sm font-mono whitespace-pre">{`import subprocess
filename = request.args['file']
# ✅ Args como lista, sin shell=True
result = subprocess.run(
  ['cat', filename],
  capture_output=True
)`}</code>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
                <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">Vulnerable (Node.js)</p>
                <code className="text-red-300 text-sm font-mono whitespace-pre">{`const { exec } = require('child_process')
const ip = req.query.ip
exec(\`ping \${ip}\`, callback)`}</code>
              </div>
              <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4">
                <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-3">Seguro (Node.js)</p>
                <code className="text-green-300 text-sm font-mono whitespace-pre">{`const { execFile } = require('child_process')
const ip = req.query.ip
// Validar IP + usar execFile
execFile('ping', [ip], callback)`}</code>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center bg-[#161b22] border border-[#30363d] rounded-2xl p-10 mb-12">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-3">¿Tu código ejecuta comandos con datos del usuario?</h2>
          <p className="text-[#8b949e] mb-6">Detecta el riesgo antes de llegar a producción. 5 análisis gratis.</p>
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
              { href: '/herramienta/detectar-csrf', label: 'Detector de CSRF' },
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
