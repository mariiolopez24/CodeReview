import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { BlogPost } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog — CodeReview AI',
  description: 'Artículos sobre code review, buenas prácticas de desarrollo, seguridad en el código e inteligencia artificial aplicada al desarrollo de software.',
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, keywords, reading_time, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <nav className="border-b border-[#30363d] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-[#e6edf3] text-xl">
            CodeReview <span className="text-blue-400">AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">Precios</Link>
            <Link href="/signup" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#e6edf3] mb-3">Blog</h1>
          <p className="text-[#8b949e] text-lg">
            Guías y artículos sobre code review, buenas prácticas e inteligencia artificial en el desarrollo de software.
          </p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#484f58] text-lg">Próximamente — artículos en camino.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post: Partial<BlogPost>) => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#484f58] transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      {post.keywords?.slice(0, 2).map((kw: string) => (
                        <span key={kw} className="text-xs bg-blue-900/30 text-blue-400 border border-blue-800/40 px-2 py-0.5 rounded-full">
                          {kw}
                        </span>
                      ))}
                      <span className="text-xs text-[#484f58] ml-auto">{post.reading_time} min de lectura</span>
                    </div>
                    <h2 className="text-xl font-semibold text-[#e6edf3] mb-2 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-[#8b949e] text-sm leading-relaxed">{post.description}</p>
                    <div className="mt-4 text-blue-400 text-sm font-medium">
                      Leer artículo →
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-[#30363d] px-6 py-8 mt-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[#484f58] text-sm">
          <span>© 2026 CodeReview AI</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-[#8b949e] transition-colors">Precios</Link>
            <Link href="/privacy" className="hover:text-[#8b949e] transition-colors">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
