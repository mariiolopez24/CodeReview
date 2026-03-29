'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { INITIAL_ARTICLES } from '@/lib/blog-topics'

interface Post {
  id: string
  slug: string
  title: string
  published: boolean
  reading_time: number
  created_at: string
}

export default function AdminClient() {
  const [posts, setPosts] = useState<Post[]>([])
  const [generating, setGenerating] = useState<string | null>(null)
  const [bulkGenerating, setBulkGenerating] = useState(false)
  const [bulkProgress, setBulkProgress] = useState(0)
  const [customTitle, setCustomTitle] = useState('')
  const [customKeywords, setCustomKeywords] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { loadPosts() }, [])

  async function loadPosts() {
    const res = await fetch('/api/blog/list')
    if (res.ok) setPosts(await res.json())
  }

  async function generateSingle(title: string, keywords: string[], publish = true) {
    setGenerating(title)
    setMessage('')
    const res = await fetch('/api/blog/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, keywords, publish }),
    })
    const data = await res.json()
    if (data.post) {
      setMessage(`✓ Artículo generado: "${data.post.title}"`)
      loadPosts()
    } else {
      setMessage(`✗ Error: ${data.error}`)
    }
    setGenerating(null)
  }

  async function generateAll() {
    setBulkGenerating(true)
    setBulkProgress(0)
    for (let i = 0; i < INITIAL_ARTICLES.length; i++) {
      const a = INITIAL_ARTICLES[i]
      setMessage(`Generando ${i + 1}/${INITIAL_ARTICLES.length}: "${a.title}"...`)
      await generateSingle(a.title, a.keywords, true)
      setBulkProgress(i + 1)
      await new Promise(r => setTimeout(r, 2000))
    }
    setMessage(`✓ Todos los artículos generados (${INITIAL_ARTICLES.length})`)
    setBulkGenerating(false)
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch('/api/blog/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, published: !published }),
    })
    loadPosts()
  }

  async function deletePost(id: string) {
    if (!confirm('¿Eliminar este artículo?')) return
    await fetch('/api/blog/publish', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadPosts()
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <header className="bg-[#161b22] border-b border-[#30363d] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-[#e6edf3] text-xl">
            CodeReview <span className="text-blue-400">AI</span>
            <span className="ml-2 text-xs text-[#484f58] font-normal">Admin</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/blog" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">Ver blog →</Link>
            <Link href="/dashboard" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">Dashboard →</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.startsWith('✓') ? 'bg-green-900/30 border border-green-700/50 text-green-400' : message.startsWith('✗') ? 'bg-red-900/30 border border-red-700/50 text-red-400' : 'bg-blue-900/30 border border-blue-700/50 text-blue-400'}`}>
            {message}
          </div>
        )}

        {/* Generate custom article */}
        <section className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#e6edf3] mb-4">Generar artículo personalizado</h2>
          <div className="flex gap-3 flex-wrap">
            <input
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder="Título del artículo"
              className="flex-1 min-w-64 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={customKeywords}
              onChange={e => setCustomKeywords(e.target.value)}
              placeholder="Keywords separadas por comas"
              className="flex-1 min-w-48 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                if (!customTitle || !customKeywords) return
                generateSingle(customTitle, customKeywords.split(',').map(k => k.trim()), true)
                setCustomTitle(''); setCustomKeywords('')
              }}
              disabled={!!generating || !customTitle}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              {generating ? 'Generando...' : 'Generar y publicar'}
            </button>
          </div>
        </section>

        {/* Bulk generate */}
        <section className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#e6edf3]">Artículos SEO predefinidos</h2>
              <p className="text-[#8b949e] text-sm mt-1">{INITIAL_ARTICLES.length} artículos optimizados para keywords de code review</p>
            </div>
            <button
              onClick={generateAll}
              disabled={bulkGenerating || !!generating}
              className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {bulkGenerating ? `Generando ${bulkProgress}/${INITIAL_ARTICLES.length}...` : 'Generar todos →'}
            </button>
          </div>

          {bulkGenerating && (
            <div className="mb-4">
              <div className="w-full bg-[#21262d] rounded-full h-2">
                <div
                  className="h-2 bg-green-500 rounded-full transition-all"
                  style={{ width: `${(bulkProgress / INITIAL_ARTICLES.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            {INITIAL_ARTICLES.map((a) => (
              <div key={a.title} className="flex items-center justify-between py-2 border-b border-[#30363d]/50">
                <div>
                  <p className="text-sm text-[#e6edf3]">{a.title}</p>
                  <p className="text-xs text-[#484f58]">{a.keywords.join(', ')}</p>
                </div>
                <button
                  onClick={() => generateSingle(a.title, a.keywords, true)}
                  disabled={!!generating || bulkGenerating}
                  className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-40 px-3 py-1 border border-blue-800/40 rounded transition-colors"
                >
                  {generating === a.title ? 'Generando...' : 'Generar'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Published posts */}
        <section className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#e6edf3]">Artículos ({posts.length})</h2>
            <button onClick={() => loadPosts()} className="text-xs text-[#8b949e] hover:text-[#e6edf3] transition-colors">
              Actualizar
            </button>
          </div>

          {posts.length === 0 ? (
            <p className="text-[#484f58] text-sm text-center py-8">No hay artículos todavía. Genera el primero arriba.</p>
          ) : (
            <div className="space-y-2">
              {posts.map(post => (
                <div key={post.id} className="flex items-center justify-between py-3 border-b border-[#30363d]/50">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm text-[#e6edf3] truncate">{post.title}</p>
                    <p className="text-xs text-[#484f58]">/blog/{post.slug} · {post.reading_time} min</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${post.published ? 'bg-green-900/30 text-green-400 border border-green-700/40' : 'bg-[#21262d] text-[#484f58] border border-[#30363d]'}`}>
                      {post.published ? 'Publicado' : 'Borrador'}
                    </span>
                    <button
                      onClick={() => togglePublish(post.id, post.published)}
                      className="text-xs text-[#8b949e] hover:text-[#e6edf3] px-2 py-1 border border-[#30363d] rounded transition-colors"
                    >
                      {post.published ? 'Ocultar' : 'Publicar'}
                    </button>
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 border border-blue-800/40 rounded transition-colors"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-800/40 rounded transition-colors"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
