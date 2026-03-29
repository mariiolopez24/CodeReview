import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/lib/supabase/check-admin";
import NewsletterSignup from "@/components/NewsletterSignup";

const features = [
  {
    icon: "🔒",
    title: "Seguridad OWASP",
    desc: "Detecta SQL injection, XSS, CSRF, secrets expuestos y todas las vulnerabilidades del Top 10 de OWASP.",
  },
  {
    icon: "🐛",
    title: "Detección de Bugs",
    desc: "Encuentra errores lógicos, nulls inesperados y edge cases antes de que lleguen a producción.",
  },
  {
    icon: "⚡",
    title: "Performance",
    desc: "Identifica cuellos de botella, loops ineficientes y operaciones costosas con soluciones concretas.",
  },
  {
    icon: "📖",
    title: "Mejores Prácticas",
    desc: "Sugerencias de legibilidad, naming, arquitectura y patrones de diseño según el lenguaje.",
  },
];

const languages = [
  "JavaScript", "TypeScript", "Python", "Go", "Rust",
  "Java", "C#", "PHP", "Ruby", "Swift",
];

const testimonials = [
  {
    name: "Carlos M.",
    role: "Senior Backend Developer",
    company: "Startup fintech, Madrid",
    avatar: "CM",
    text: "En mi primer análisis encontré una inyección SQL que llevaba meses en producción. Ahora lo uso antes de cada merge. Imprescindible.",
  },
  {
    name: "Ana García",
    role: "CTO",
    company: "Agencia digital, Barcelona",
    avatar: "AG",
    text: "Le doy el código a mis juniors para que vean los problemas explicados. Es mejor que cualquier formación que haya pagado. Y mucho más barato.",
  },
  {
    name: "David L.",
    role: "Desarrollador freelance",
    company: "Full-stack, Valencia",
    avatar: "DL",
    text: "Sin instalar nada, sin conectar el repo. Pego el código y listo. Para proyectos de clientes donde no puedo instalar extensiones, es perfecto.",
  },
];

const faqs = [
  {
    q: "¿Es seguro pegar mi código aquí?",
    a: "Tu código se procesa en tiempo real y no se almacena en nuestros servidores de análisis. Usamos la API de Anthropic (Claude) que no guarda los datos enviados para entrenamiento. Los resultados sí se guardan en tu historial para que puedas consultarlos.",
  },
  {
    q: "¿Qué diferencia hay entre el plan Free y el Pro?",
    a: "Free incluye 5 análisis al mes con reporte básico. Pro incluye análisis ilimitados, reporte completo con análisis de seguridad OWASP detallado, historial completo y soporte prioritario por $12/mes. Sin permanencia.",
  },
  {
    q: "¿Funciona con mi lenguaje de programación?",
    a: "Sí. Soportamos JavaScript, TypeScript, Python, Go, Rust, Java, C#, PHP, Ruby, Swift y más. Si no sabes el lenguaje, el modo auto-detectar lo identifica automáticamente.",
  },
  {
    q: "¿Necesito conectar mi repositorio de GitHub?",
    a: "No. Eso es precisamente nuestra ventaja. Copia el fragmento de código que quieres analizar, pégalo y obtienes el informe. Sin permisos, sin OAuth, sin configuración.",
  },
  {
    q: "¿Cómo es el análisis de seguridad?",
    a: "Seguimos el estándar OWASP Top 10: SQL Injection, XSS, CSRF, secrets expuestos, autenticación insegura, configuraciones débiles... Cada vulnerabilidad viene con severidad (critical/high/medium/low) y con el fix específico para tu código.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí, sin penalizaciones ni permanencia. Cancelas desde tu área de cuenta en menos de 30 segundos y no se te cobra el mes siguiente.",
  },
];

const comparisons = [
  {
    feature: "Análisis de seguridad OWASP",
    us: true,
    copilot: false,
    coderabbit: "parcial",
  },
  {
    feature: "Sin instalación ni IDE",
    us: true,
    copilot: false,
    coderabbit: false,
  },
  {
    feature: "Pega y analiza en 30s",
    us: true,
    copilot: false,
    coderabbit: false,
  },
  {
    feature: "Gratis para empezar",
    us: true,
    copilot: false,
    coderabbit: true,
  },
  {
    feature: "Explicaciones educativas",
    us: true,
    copilot: "parcial",
    coderabbit: false,
  },
  {
    feature: "Análisis sin repositorio",
    us: true,
    copilot: false,
    coderabbit: false,
  },
];

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user ? await checkIsAdmin() : false;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {/* Navbar */}
      <nav className="border-b border-[#30363d] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-bold text-[#e6edf3] text-xl">
            CodeReview <span className="text-blue-400">AI</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">
              Blog
            </Link>
            <Link href="/pricing" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">
              Precios
            </Link>
            <Link href="/comparar" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">
              Comparar
            </Link>
            {user ? (
              <>
                <Link href="/account" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">
                  Mi cuenta
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="text-xs text-purple-400 hover:text-purple-300 border border-purple-800/50 px-3 py-1.5 rounded-lg hover:bg-purple-900/20 transition-colors">
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Ir al dashboard →
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">
                  Iniciar sesión
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Empezar gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-red-900/30 text-red-400 text-sm font-medium px-3 py-1 rounded-full mb-6 border border-red-800/50">
          Detecta vulnerabilidades de seguridad antes que nadie
        </div>
        <h1 className="text-5xl font-bold text-[#e6edf3] leading-tight mb-6">
          Code Review con IA enfocado en{" "}
          <span className="text-red-400">Seguridad</span>
        </h1>
        <p className="text-xl text-[#8b949e] max-w-2xl mx-auto mb-10">
          Detecta vulnerabilidades OWASP, bugs críticos y problemas de performance
          en segundos. Sin instalar nada. Sin conectar tu repositorio.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors text-lg"
          >
            {user ? "Ir al dashboard →" : "Analizar mi código gratis →"}
          </Link>
          <Link href="/comparar" className="text-[#8b949e] hover:text-[#e6edf3] font-medium transition-colors">
            Comparar con alternativas →
          </Link>
        </div>
        {!user && (
          <p className="text-[#484f58] text-sm mt-4">
            5 reviews gratuitos · Sin tarjeta de crédito · Listo en 30 segundos
          </p>
        )}
      </section>

      {/* Social proof bar */}
      <div className="border-y border-[#30363d] bg-[#161b22]/50 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-8 flex-wrap text-sm text-[#484f58]">
          <span>✓ Sin registro en GitHub ni GitLab</span>
          <span>✓ Compatible con 10+ lenguajes</span>
          <span>✓ Análisis OWASP Top 10</span>
          <span>✓ Resultado en menos de 30s</span>
        </div>
      </div>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#e6edf3] text-center mb-4">
          Más que un linter. Un experto en seguridad.
        </h2>
        <p className="text-[#8b949e] text-center mb-12 max-w-2xl mx-auto">
          Mientras otros tools señalan estilo y formateo, CodeReview AI encuentra
          lo que realmente importa: vulnerabilidades que pueden costarte caro.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 border border-[#30363d] rounded-xl bg-[#161b22] hover:border-[#484f58] transition-colors">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-[#e6edf3] mb-2">{f.title}</h3>
              <p className="text-[#8b949e] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#e6edf3] text-center mb-4">
          ¿Por qué CodeReview AI y no GitHub Copilot?
        </h2>
        <p className="text-[#8b949e] text-center mb-10">
          Copilot es un asistente de escritura. CodeReview AI es un auditor de seguridad.
        </p>
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#30363d]">
                <th className="px-6 py-4 text-left text-[#8b949e] font-medium">Característica</th>
                <th className="px-6 py-4 text-center text-blue-400 font-semibold">CodeReview AI</th>
                <th className="px-6 py-4 text-center text-[#8b949e] font-medium">GitHub Copilot</th>
                <th className="px-6 py-4 text-center text-[#8b949e] font-medium">CodeRabbit</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr key={row.feature} className={`border-b border-[#30363d]/50 ${i % 2 === 0 ? '' : 'bg-[#0d1117]/40'}`}>
                  <td className="px-6 py-3 text-[#8b949e]">{row.feature}</td>
                  <td className="px-6 py-3 text-center">
                    {row.us === true ? <span className="text-green-400">✓</span> : <span className="text-red-500">✗</span>}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {row.copilot === true ? <span className="text-green-400">✓</span> : row.copilot === 'parcial' ? <span className="text-yellow-500">~</span> : <span className="text-red-500">✗</span>}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {row.coderabbit === true ? <span className="text-green-400">✓</span> : row.coderabbit === 'parcial' ? <span className="text-yellow-500">~</span> : <span className="text-red-500">✗</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center mt-4 text-[#484f58] text-xs">
          ~ = funcionalidad parcial o con limitaciones
        </p>
        <div className="text-center mt-6">
          <Link href="/comparar" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
            Ver comparativa completa →
          </Link>
        </div>
      </section>

      {/* Languages */}
      <section className="bg-[#161b22] border-y border-[#30363d] py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#8b949e] text-sm font-medium uppercase tracking-wider mb-6">
            Compatible con todos los lenguajes principales
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {languages.map((lang) => (
              <span
                key={lang}
                className="bg-[#0d1117] border border-[#30363d] text-[#8b949e] text-sm px-3 py-1 rounded-full"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { stat: "< 30s", label: "Tiempo promedio de análisis" },
            { stat: "OWASP", label: "Top 10 vulnerabilidades detectadas" },
            { stat: "10+", label: "Lenguajes soportados" },
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
          Lo que dicen los desarrolladores
        </h2>
        <p className="text-[#8b949e] text-center mb-12 max-w-xl mx-auto">
          Más de 200 developers ya usan CodeReview AI en su flujo de trabajo diario.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col gap-4 hover:border-[#484f58] transition-colors">
              <p className="text-[#8b949e] text-sm leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#30363d]">
                <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-400">
                  {t.avatar}
                </div>
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
          Preguntas frecuentes
        </h2>
        <div className="space-y-0 border border-[#30363d] rounded-xl overflow-hidden divide-y divide-[#30363d]">
          {faqs.map((faq) => (
            <details key={faq.q} className="group bg-[#161b22] open:bg-[#161b22]">
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
            Audita tu código hoy, gratis
          </h2>
          <p className="text-[#8b949e] mb-8">
            5 reviews gratis. Sin tarjeta. Sin instalar nada.
          </p>
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors inline-block"
          >
            Crear cuenta gratis →
          </Link>
          <p className="text-[#484f58] text-xs mt-4">¿Ya tienes cuenta? <Link href="/login" className="text-blue-500 hover:text-blue-400">Inicia sesión →</Link></p>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#30363d] px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <span className="font-bold text-[#e6edf3] text-lg">CodeReview <span className="text-blue-400">AI</span></span>
              <p className="text-[#484f58] text-sm mt-2 max-w-xs">
                Análisis de seguridad de código con IA. Sin instalar nada. Sin conectar repositorios.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div>
                <p className="text-[#8b949e] font-medium mb-3">Producto</p>
                <div className="space-y-2">
                  <Link href="/pricing" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">Precios</Link>
                  <Link href="/comparar" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">Comparar</Link>
                  <Link href="/dashboard" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">Dashboard</Link>
                </div>
              </div>
              <div>
                <p className="text-[#8b949e] font-medium mb-3">Recursos</p>
                <div className="space-y-2">
                  <Link href="/blog" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">Blog</Link>
                  <Link href="/privacy" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">Privacidad</Link>
                </div>
              </div>
              <div>
                <p className="text-[#8b949e] font-medium mb-3">Cuenta</p>
                <div className="space-y-2">
                  <Link href="/signup" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">Registro</Link>
                  <Link href="/login" className="block text-[#484f58] hover:text-[#8b949e] transition-colors">Iniciar sesión</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#30363d] pt-6 flex items-center justify-between text-[#484f58] text-xs">
            <span>© 2026 CodeReview AI — Todos los derechos reservados</span>
            <span>Hecho con ☕ en España</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
