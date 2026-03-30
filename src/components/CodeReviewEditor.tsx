'use client'

import { useState, useEffect } from 'react'
import type { ReviewResult } from '@/types'
import AdBanner from '@/components/AdBanner'

const LANGUAGES = [
  'auto', 'javascript', 'typescript', 'python', 'go',
  'rust', 'java', 'csharp', 'php', 'ruby', 'swift',
]

const EXAMPLE_CODE = `# Ejemplo con vulnerabilidades reales — ¡analiza este código!
import sqlite3
import hashlib

def login(username, password):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    # ⚠️ SQL Injection: entrada no sanitizada
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    cursor.execute(query)
    user = cursor.fetchone()
    conn.close()
    return user

def store_password(pwd):
    # ⚠️ MD5 es inseguro para contraseñas
    return hashlib.md5(pwd.encode()).hexdigest()

def get_user_data(user_id):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    # ⚠️ Sin validación de autorización
    cursor.execute(f"SELECT * FROM users WHERE id={user_id}")
    return cursor.fetchall()
`

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
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallResult, setPaywallResult] = useState<ReviewResult | null>(null)

  const canReview = reviewsLimit === -1 || reviewsUsed < reviewsLimit
  const reviewsLeft = reviewsLimit === -1 ? Infinity : reviewsLimit - reviewsUsed
  const isNearLimit = reviewsLimit !== -1 && reviewsLeft === 1

  useEffect(() => {
    const visited = localStorage.getItem('codereview_visited')
    if (!visited) {
      setCode(EXAMPLE_CODE)
      setLanguage('python')
      localStorage.setItem('codereview_visited', '1')
    }
  }, [])

  async function handleReview() {
    if (!code.trim() || !canReview) return
    setLoading(true)
    setError('')
    setResult(null)
    setShowPaywall(false)

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

      const reviewResult = data.result as ReviewResult

      // Show upgrade banner when on last free review
      if (isNearLimit) {
        setShowUpgradeBanner(true)
      }

      // If this was the last free review, show paywall with partial results
      if (reviewsLimit !== -1 && reviewsUsed + 1 >= reviewsLimit) {
        setPaywallResult(reviewResult)
        setShowPaywall(true)
        // Show only summary and score, blur the rest
        setResult(reviewResult)
      } else {
        setResult(reviewResult)
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Near-limit warning banner */}
      {showUpgradeBanner && !showPaywall && (
        <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <span>⚡</span>
            <span>Último análisis gratuito — hazte Pro para análisis ilimitados</span>
          </div>
          <a
            href="/pricing"
            className="bg-yellow-500 text-black text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition-colors whitespace-nowrap"
          >
            Ver planes →
          </a>
        </div>
      )}

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
            <span className="text-xs text-[#484f58]">{code.length} chars</span>
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
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden relative">
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

          {result && !showPaywall && (
            <>
              <ReviewResults result={result} />
              {plan === 'free' && (
                <div className="px-4 pb-4">
                  <AdBanner
                    slot="7849861624"
                    format="rectangle"
                    className="border border-[#30363d] rounded-xl p-2 bg-[#0d1117]"
                  />
                </div>
              )}
            </>
          )}

          {result && showPaywall && (
            <div className="relative">
              {/* Show partial result (blurred) */}
              <div className="blur-sm pointer-events-none select-none">
                <ReviewResults result={result} />
              </div>
              {/* Paywall overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1117]/80 backdrop-blur-sm px-6 text-center">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="text-[#e6edf3] font-bold text-lg mb-1">Has alcanzado el límite gratuito</h3>
                <p className="text-[#8b949e] text-sm mb-4 max-w-xs">
                  Puntuación: <span className="text-white font-bold">{result.score}/100</span> · {result.issues.length} problemas · {result.security.length} vulnerabilidades
                </p>
                <p className="text-[#484f58] text-xs mb-5">Hazte Pro para ver el análisis completo y análisis ilimitados</p>
                <a
                  href="/pricing"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-500 transition-colors text-sm"
                >
                  Ver planes — desde $12/mes →
                </a>
                <p className="text-xs text-[#484f58] mt-3">7 días de garantía de devolución</p>
              </div>
            </div>
          )}
        </div>
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

      {/* Corrected code */}
      {result.corrected_code && (
        <CorrectedCode code={result.corrected_code} />
      )}
    </div>
  )
}

function CorrectedCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider">
          Código corregido
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs bg-green-900/30 border border-green-700/40 text-green-400 px-2.5 py-1 rounded-lg hover:bg-green-900/50 transition-colors"
        >
          {copied ? '✓ Copiado' : '⎘ Copiar'}
        </button>
      </div>
      <pre className="bg-[#0d1117] border border-green-700/30 rounded-lg p-3 overflow-x-auto text-xs text-[#e6edf3] font-mono whitespace-pre-wrap max-h-72 overflow-y-auto">
        {code}
      </pre>
    </div>
  )
}
