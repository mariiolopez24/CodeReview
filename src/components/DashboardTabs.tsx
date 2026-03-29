'use client'

import { useState } from 'react'
import CodeReviewEditor from './CodeReviewEditor'
import type { ReviewResult } from '@/types'

interface HistoryItem {
  id: string
  language: string
  result: ReviewResult
  created_at: string
}

interface Props {
  plan: string
  reviewsUsed: number
  reviewsLimit: number
  recentReviews: HistoryItem[]
}

export default function DashboardTabs({ plan, reviewsUsed, reviewsLimit, recentReviews }: Props) {
  const [tab, setTab] = useState<'new' | 'history'>('new')

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#161b22] border border-[#30363d] rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('new')}
          className={`px-4 py-2 text-sm rounded-md transition-colors font-medium ${
            tab === 'new'
              ? 'bg-[#21262d] text-[#e6edf3] shadow-sm'
              : 'text-[#8b949e] hover:text-[#e6edf3]'
          }`}
        >
          Nuevo análisis
        </button>
        <button
          onClick={() => setTab('history')}
          className={`px-4 py-2 text-sm rounded-md transition-colors font-medium flex items-center gap-2 ${
            tab === 'history'
              ? 'bg-[#21262d] text-[#e6edf3] shadow-sm'
              : 'text-[#8b949e] hover:text-[#e6edf3]'
          }`}
        >
          Historial
          {recentReviews.length > 0 && (
            <span className="bg-blue-600/30 text-blue-400 text-xs px-1.5 py-0.5 rounded-full">
              {recentReviews.length}
            </span>
          )}
        </button>
      </div>

      {tab === 'new' && (
        <CodeReviewEditor plan={plan} reviewsUsed={reviewsUsed} reviewsLimit={reviewsLimit} />
      )}

      {tab === 'history' && (
        <ReviewHistory reviews={recentReviews} />
      )}
    </div>
  )
}

function ReviewHistory({ reviews }: { reviews: HistoryItem[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (reviews.length === 0) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-16 text-center">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-[#e6edf3] font-medium mb-2">Sin análisis todavía</p>
        <p className="text-[#484f58] text-sm">Haz tu primer análisis y aparecerá aquí guardado automáticamente.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => {
        const score = review.result?.score ?? 0
        const scoreColor =
          score >= 80 ? 'text-green-400' :
          score >= 60 ? 'text-yellow-400' :
          'text-red-400'
        const scoreBg =
          score >= 80 ? 'bg-green-900/20 border-green-800/40' :
          score >= 60 ? 'bg-yellow-900/20 border-yellow-800/40' :
          'bg-red-900/20 border-red-800/40'
        const date = new Date(review.created_at).toLocaleDateString('es-ES', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
        const isOpen = expanded === review.id
        const secCount = review.result?.security?.length ?? 0
        const issueCount = review.result?.issues?.length ?? 0

        return (
          <div key={review.id} className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#484f58] transition-colors">
            <button
              onClick={() => setExpanded(isOpen ? null : review.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg border flex items-center justify-center ${scoreBg}`}>
                  <span className={`text-xl font-bold ${scoreColor}`}>{score}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-[#e6edf3] capitalize">{review.language}</span>
                    {secCount > 0 && (
                      <span className="text-xs text-red-400 bg-red-900/30 border border-red-800/40 px-1.5 py-0.5 rounded-full">
                        {secCount} vulnerabilidad{secCount > 1 ? 'es' : ''}
                      </span>
                    )}
                    {issueCount > 0 && (
                      <span className="text-xs text-yellow-400 bg-yellow-900/30 border border-yellow-800/40 px-1.5 py-0.5 rounded-full">
                        {issueCount} issue{issueCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#484f58]">{date}</p>
                  <p className="text-sm text-[#8b949e] mt-1 truncate max-w-lg hidden md:block">
                    {review.result?.summary}
                  </p>
                </div>
              </div>
              <span className="text-[#484f58] text-xs flex-shrink-0 ml-4">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="border-t border-[#30363d] px-5 py-5 space-y-4">
                {/* Summary */}
                {review.result?.summary && (
                  <p className="text-sm text-[#8b949e] italic leading-relaxed">"{review.result.summary}"</p>
                )}

                {/* Security */}
                {review.result?.security?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                      Seguridad ({review.result.security.length})
                    </p>
                    <div className="space-y-1.5">
                      {review.result.security.map((s, i) => (
                        <div key={i} className="text-sm bg-red-900/30 border border-red-700/40 p-3 rounded-lg">
                          <span className="text-red-400 font-medium text-xs uppercase">[{s.severity}]</span>
                          <p className="text-red-300 mt-0.5">{s.message}</p>
                          <p className="text-red-400/70 text-xs mt-1">Fix: {s.fix}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Issues */}
                {review.result?.issues?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#484f58] uppercase tracking-wider mb-2">
                      Problemas ({review.result.issues.length})
                    </p>
                    <div className="space-y-1.5">
                      {review.result.issues.map((issue, i) => (
                        <div key={i} className={`text-sm p-2 rounded-lg ${
                          issue.type === 'error'
                            ? 'bg-red-900/30 border border-red-700/40 text-red-400'
                            : issue.type === 'warning'
                            ? 'bg-yellow-900/30 border border-yellow-700/40 text-yellow-400'
                            : 'bg-blue-900/30 border border-blue-700/40 text-blue-400'
                        }`}>
                          <p className="font-medium">{issue.message}</p>
                          {issue.fix && <p className="mt-1 opacity-75 text-xs">Fix: {issue.fix}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {review.result?.suggestions?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#484f58] uppercase tracking-wider mb-2">Sugerencias</p>
                    <div className="space-y-1.5">
                      {review.result.suggestions.map((s, i) => (
                        <div key={i} className="text-sm border border-[#30363d] bg-[#21262d] p-2 rounded-lg">
                          <span className="text-xs text-[#484f58]">{s.category}</span>
                          <p className="text-[#8b949e] mt-0.5">{s.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance */}
                {review.result?.performance?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#484f58] uppercase tracking-wider mb-2">Performance</p>
                    <div className="space-y-1.5">
                      {review.result.performance.map((p, i) => (
                        <div key={i} className="text-sm bg-orange-900/30 border border-orange-700/40 p-2 rounded-lg text-orange-300">
                          <span className="text-xs font-medium uppercase">[{p.impact}]</span>
                          <p className="mt-0.5">{p.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
