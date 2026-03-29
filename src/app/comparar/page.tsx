import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CodeReview AI vs GitHub Copilot vs CodeRabbit — Comparativa completa',
  description: 'Comparamos CodeReview AI con GitHub Copilot, CodeRabbit y otras herramientas de code review. Descubre cuál detecta más vulnerabilidades de seguridad y cuál se adapta mejor a tu flujo de trabajo.',
  keywords: ['code review ia comparativa', 'codereview ai vs copilot', 'alternativa github copilot', 'coderabbit alternativa', 'herramienta code review seguridad'],
}

const tools = [
  { key: 'us', name: 'CodeReview AI', highlight: true },
  { key: 'copilot', name: 'GitHub Copilot' },
  { key: 'coderabbit', name: 'CodeRabbit' },
  { key: 'sonarqube', name: 'SonarQube' },
]

const categories = [
  {
    name: 'Facilidad de uso',
    rows: [
      { feature: 'Sin instalación requerida', us: true, copilot: false, coderabbit: false, sonarqube: false },
      { feature: 'Funciona sin conectar repositorio', us: true, copilot: false, coderabbit: false, sonarqube: false },
      { feature: 'Análisis en menos de 30 segundos', us: true, copilot: false, coderabbit: false, sonarqube: false },
      { feature: 'Interfaz web (sin IDE)', us: true, copilot: false, coderabbit: false, sonarqube: 'parcial' },
    ],
  },
  {
    name: 'Seguridad',
    rows: [
      { feature: 'Detección OWASP Top 10', us: true, copilot: false, coderabbit: 'parcial', sonarqube: true },
      { feature: 'SQL Injection', us: true, copilot: false, coderabbit: 'parcial', sonarqube: true },
      { feature: 'XSS / CSRF', us: true, copilot: false, coderabbit: 'parcial', sonarqube: true },
      { feature: 'Secrets expuestos', us: true, copilot: false, coderabbit: true, sonarqube: 'parcial' },
      { feature: 'Autenticación insegura', us: true, copilot: false, coderabbit: false, sonarqube: 'parcial' },
    ],
  },
  {
    name: 'Análisis de código',
    rows: [
      { feature: 'Detección de bugs lógicos', us: true, copilot: 'parcial', coderabbit: true, sonarqube: true },
      { feature: 'Análisis de performance', us: true, copilot: 'parcial', coderabbit: 'parcial', sonarqube: 'parcial' },
      { feature: 'Mejores prácticas', us: true, copilot: true, coderabbit: true, sonarqube: true },
      { feature: 'Explicaciones educativas', us: true, copilot: 'parcial', coderabbit: false, sonarqube: false },
    ],
  },
  {
    name: 'Precio y acceso',
    rows: [
      { feature: 'Plan gratuito disponible', us: true, copilot: false, coderabbit: true, sonarqube: 'parcial' },
      { feature: 'Precio plan base', us: '$12/mes', copilot: '$19/mes', coderabbit: '$19/mes', sonarqube: 'Auto-hosted' },
      { feature: 'Sin tarjeta para empezar', us: true, copilot: false, coderabbit: true, sonarqube: false },
    ],
  },
]

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <span className="text-green-400 text-base">✓</span>
  if (value === false) return <span className="text-red-500 text-base">✗</span>
  if (value === 'parcial') return <span className="text-yellow-500 text-sm">~</span>
  return <span className="text-[#8b949e] text-xs">{value}</span>
}

export default function CompararPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <nav className="border-b border-[#30363d] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-[#e6edf3] text-xl">
            CodeReview <span className="text-blue-400">AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">Blog</Link>
            <Link href="/pricing" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">Precios</Link>
            <Link href="/signup" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <div className="inline-block bg-blue-900/30 text-blue-400 text-sm font-medium px-3 py-1 rounded-full mb-4 border border-blue-800/50">
            Comparativa 2026
          </div>
          <h1 className="text-4xl font-bold text-[#e6edf3] mb-4">
            CodeReview AI vs GitHub Copilot vs CodeRabbit
          </h1>
          <p className="text-[#8b949e] text-lg max-w-2xl mx-auto">
            No todas las herramientas de code review son iguales. Esta es la comparativa
            honesta para que elijas la que mejor se adapta a tu equipo.
          </p>
        </div>

        {/* Quick verdict */}
        <div className="grid md:grid-cols-3 gap-4 mb-14">
          <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-5">
            <div className="text-blue-400 font-semibold mb-2">CodeReview AI</div>
            <p className="text-[#8b949e] text-sm">
              Mejor para: developers que quieren un análisis de seguridad rápido sin instalar nada.
              Pega tu código, obtén el informe.
            </p>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
            <div className="text-[#e6edf3] font-semibold mb-2">GitHub Copilot</div>
            <p className="text-[#8b949e] text-sm">
              Mejor para: autocompletado y sugerencias en el IDE. No es una herramienta de seguridad.
            </p>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
            <div className="text-[#e6edf3] font-semibold mb-2">CodeRabbit</div>
            <p className="text-[#8b949e] text-sm">
              Mejor para: equipos que ya usan GitHub/GitLab y quieren revisión automática de PRs.
            </p>
          </div>
        </div>

        {/* Comparison tables by category */}
        {categories.map((cat) => (
          <div key={cat.name} className="mb-10">
            <h2 className="text-xl font-bold text-[#e6edf3] mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-500 rounded-full inline-block"></span>
              {cat.name}
            </h2>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#30363d]">
                    <th className="px-5 py-3 text-left text-[#8b949e] font-medium">Característica</th>
                    {tools.map((t) => (
                      <th key={t.key} className={`px-5 py-3 text-center font-semibold ${t.highlight ? 'text-blue-400' : 'text-[#8b949e]'}`}>
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cat.rows.map((row, i) => (
                    <tr key={row.feature} className={`border-b border-[#30363d]/50 ${i % 2 === 1 ? 'bg-[#0d1117]/40' : ''}`}>
                      <td className="px-5 py-3 text-[#8b949e]">{row.feature}</td>
                      <td className="px-5 py-3 text-center"><Cell value={row.us} /></td>
                      <td className="px-5 py-3 text-center"><Cell value={row.copilot} /></td>
                      <td className="px-5 py-3 text-center"><Cell value={row.coderabbit} /></td>
                      <td className="px-5 py-3 text-center"><Cell value={row.sonarqube} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Conclusion */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 mt-10">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-4">Conclusión</h2>
          <div className="space-y-4 text-[#8b949e] leading-relaxed">
            <p>
              <strong className="text-[#e6edf3]">GitHub Copilot</strong> es una herramienta excelente para escribir código más rápido, pero no está diseñada para detectar vulnerabilidades. Si lo usas esperando que proteja tu código, te llevarás una sorpresa.
            </p>
            <p>
              <strong className="text-[#e6edf3]">CodeRabbit</strong> funciona bien integrado en el flujo de PRs, pero requiere conectar tu repositorio y no cubre análisis de seguridad en profundidad.
            </p>
            <p>
              <strong className="text-[#e6edf3]">CodeReview AI</strong> está diseñado específicamente para detectar problemas de seguridad siguiendo el estándar OWASP Top 10. No necesitas configurar nada: pega el código, obtén el análisis.
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors"
            >
              Probar gratis 5 reviews →
            </Link>
            <Link href="/pricing" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">
              Ver precios →
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-8">Preguntas frecuentes</h2>
          <div className="space-y-6">
            {[
              {
                q: '¿CodeReview AI es una alternativa a GitHub Copilot?',
                a: 'Son herramientas con propósitos diferentes. Copilot ayuda a escribir código; CodeReview AI lo analiza en busca de errores y vulnerabilidades. Se complementan bien.',
              },
              {
                q: '¿Necesito conectar mi repositorio de GitHub?',
                a: 'No. CodeReview AI funciona con copia-pega. Simplemente pega el código que quieres analizar y en menos de 30 segundos tienes el informe.',
              },
              {
                q: '¿Cómo de preciso es el análisis de seguridad?',
                a: 'Utilizamos Claude (el modelo de Anthropic) con instrucciones específicas para detectar vulnerabilidades OWASP. Los resultados son detallados y accionables, no genéricos.',
              },
              {
                q: '¿Hay un plan gratuito?',
                a: 'Sí. El plan gratuito incluye 5 reviews al mes sin tarjeta de crédito. Suficiente para evaluar si la herramienta se adapta a tu flujo de trabajo.',
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-[#30363d] pb-6">
                <h3 className="font-semibold text-[#e6edf3] mb-2">{item.q}</h3>
                <p className="text-[#8b949e] text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-[#30363d] px-6 py-8 mt-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[#484f58] text-sm">
          <span>© 2026 CodeReview AI</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-[#8b949e] transition-colors">Precios</Link>
            <Link href="/blog" className="hover:text-[#8b949e] transition-colors">Blog</Link>
            <Link href="/privacy" className="hover:text-[#8b949e] transition-colors">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
