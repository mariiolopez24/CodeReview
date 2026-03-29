import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-8xl font-bold text-[#30363d] mb-4 select-none">404</div>
      <h1 className="text-2xl font-bold text-[#e6edf3] mb-3">Página no encontrada</h1>
      <p className="text-[#8b949e] mb-8 max-w-sm">
        La página que buscas no existe o ha sido movida.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-500 transition-colors font-medium"
        >
          Ir al inicio
        </Link>
        <Link
          href="/dashboard"
          className="bg-[#21262d] border border-[#30363d] text-[#e6edf3] px-5 py-2.5 rounded-lg hover:bg-[#30363d] transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
}
