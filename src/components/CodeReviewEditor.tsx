'use client'

import { useState } from 'react'
import type { ReviewResult } from '@/types'

const LANGUAGES = [
  'auto', 'javascript', 'typescript', 'python', 'go',
  'rust', 'java', 'csharp', 'php', 'ruby', 'swift',
]

interface Props {
  plan: string
  reviewsUsed: number
  reviewsLimit: number
}

export default function CodeReviewEditor({ plan, reviewsUsed, reviewsLimit }: Props) {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('auto')
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canReview = reviewsLimit === -1 || reviewsUsed < reviewsLimit

  async function handleReview() {
    if (!code.trim() || !canReview) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al analizar el código')
        return
      }

      setResult(data.result)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Editor */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
          <span className="text-sm font-medium text-[#8b949e]">Tu código</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm bg-[#21262d] border border-[#30363d] rounded-lg px-2 py-1 text-[#8b949e] focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l === 'auto' ? 'Auto-detectar' : l}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Pega aquí tu código..."
          className="w-full h-80 p-4 font-mono text-sm text-[#e6edf3] bg-[#161b22] resize-none focus:outline-none placeholder-[#484f58]"
        />
        <div className="px-4 py-3 border-t border-[#30363d] flex items-center justify-between">
          <span className="text-xs text-[#484f58]">{code.length} caracteres</span>
          {!canReview ? (
            <a
              href="/pricing"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              Upgrade para continuar →
            </a>
          ) : (
            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-40 transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block">⟳</span> Analizando...
                </span>
              ) : (
                'Analizar código →'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#30363d]">
          <span className="text-sm font-medium text-[#8b949e]">Resultado del análisis</span>
        </div>

        {error && (
          <div className="m-4 bg-red-900/30 border border-red-700/50 text-red-400 text-sm p-3 rounded-lg">{error}</div>
        )}

        {!result && !loading && !error && (
          <div className="flex flex-col items-center justify-center min-h-[320px] gap-3 text-center px-6">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-[#8b949e] text-sm font-medium">El análisis aparecerá aquí</p>
            <p className="text-[#484f58] text-xs max-w-xs">Pega código en el editor de la izquierda y pulsa "Analizar código"</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[320px] gap-3 text-[#8b949e]">
            <div className="animate-spin text-3xl">⟳</div>
            <p className="text-sm font-medium">Analizando con Claude AI...</p>
            <p className="text-xs text-[#484f58]">Suele tardar 10-20 segundos</p>
          </div>
        )}

        {result && <ReviewResults result={result} />}
      </div>
    </div>
  )
}

function ReviewResults({ result }: { result: ReviewResult }) {
  const scoreColor =
    result.score >= 80 ? 'text-green-400' :
    result.score >= 60 ? 'text-yellow-400' :
    'text-red-400'

  return (
    <div className="min-h-[320px] max-h-[600px] overflow-y-auto p-4 space-y-5">
      {/* Score */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#484f58] uppercase tracking-wider mb-1">Puntuación</p>
          <p className={`text-4xl font-bold ${scoreColor}`}>{result.score}<span className="text-lg text-[#484f58]">/100</span></p>
        </div>
        <div className="text-right max-w-xs">
          <p className="text-sm text-[#8b949e] leading-relaxed">{result.summary}</p>
        </div>
      </div>

      {/* Issues */}
      {result.issues.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#484f58] uppercase tracking-wider mb-2">
            Problemas ({result.issues.length})
          </h3>
          <div className="space-y-2">
            {result.issues.map((issue, i) => (
              <div key={i} className={`text-sm p-2 rounded-lg ${
                issue.type === 'error' ? 'bg-red-900/30 border border-red-700/40 text-red-400' :
                issue.type === 'warning' ? 'bg-yellow-900/30 border border-yellow-700/40 text-yellow-400' :
                'bg-blue-900/30 border border-blue-700/40 text-blue-400'
              }`}>
                <p className="font-medium">{issue.message}</p>
                {issue.fix && <p className="mt-1 opacity-75 text-xs">Fix: {issue.fix}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security */}
      {result.security.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
            Seguridad ({result.security.length})
          </h3>
          <div className="space-y-2">
            {result.security.map((s, i) => (
              <div key={i} className="text-sm bg-red-900/30 border border-red-700/40 p-2 rounded-lg">
                <span className="font-medium text-red-400 uppercase text-xs">[{s.severity}]</span>
                <p className="text-red-300 mt-0.5">{s.message}</p>
                <p className="text-red-400/70 text-xs mt-1">Fix: {s.fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#484f58] uppercase tracking-wider mb-2">
            Sugerencias
          </h3>
          <div className="space-y-2">
            {result.suggestions.map((s, i) => (
              <div key={i} className="text-sm border border-[#30363d] bg-[#21262d] p-2 rounded-lg">
                <span className="text-xs font-medium text-[#484f58]">{s.category}</span>
                <p className="text-[#8b949e] mt-0.5">{s.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance */}
      {result.performance.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#484f58] uppercase tracking-wider mb-2">
            Performance
          </h3>
          <div className="space-y-2">
            {result.performance.map((p, i) => (
              <div key={i} className="text-sm bg-orange-900/30 border border-orange-700/40 p-2 rounded-lg text-orange-300">
                <span className="text-xs font-medium uppercase">[{p.impact}]</span>
                <p className="mt-0.5">{p.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
