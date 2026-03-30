import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { BlogPost } from '@/lib/blog'
import NewsletterSignup from '@/components/NewsletterSignup'
import AdBanner from '@/components/AdBanner'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, description, keywords')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'Artículo no encontrado' }

  return {
    title: `${post.title} — CodeReview AI`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const p = post as BlogPost
  const date = new Date(p.created_at).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <nav className="border-b border-[#30363d] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-[#e6edf3] text-xl">
            CodeReview <span className="text-blue-400">AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-[#8b949e] hover:text-[#e6edf3] text-sm transition-colors">← Blog</Link>
            <Link href="/signup" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {p.keywords.slice(0, 3).map((kw) => (
              <span key={kw} className="text-xs bg-blue-900/30 text-blue-400 border border-blue-800/40 px-2 py-0.5 rounded-full">
                {kw}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-[#e6edf3] leading-tight mb-4">{p.title}</h1>
          <p className="text-[#8b949e] text-lg leading-relaxed mb-6">{p.description}</p>
          <div className="flex items-center gap-4 text-sm text-[#484f58] border-t border-[#30363d] pt-4">
            <span>{date}</span>
            <span>·</span>
            <span>{p.reading_time} min de lectura</span>
          </div>
        </header>

        {/* Content rendered as markdown */}
        <MarkdownContent content={p.content} />

        {/* Ad mid-article */}
        <AdBanner
          slot="2836541811"
          format="horizontal"
          className="my-8 border border-[#30363d] rounded-xl p-3 bg-[#161b22]"
        />

        {/* Newsletter mid-article */}
        <div className="my-12">
          <NewsletterSignup source="blog" compact={false} />
        </div>

        {/* CTA */}
        <div className="mt-8 bg-[#161b22] border border-[#30363d] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-3">
            Prueba CodeReview AI gratis
          </h2>
          <p className="text-[#8b949e] mb-6">
            Analiza tu código con IA en segundos. 10 reviews gratuitos, sin tarjeta de crédito.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors"
          >
            Empezar gratis →
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="text-[#8b949e] hover:text-blue-400 text-sm transition-colors">
            ← Ver todos los artículos
          </Link>
        </div>
      </main>
    </div>
  )
}

// Simple markdown renderer without extra deps
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={i} className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 overflow-x-auto my-6">
          <code className="text-sm text-[#e6edf3] font-mono">{codeLines.join('\n')}</code>
        </pre>
      )
    }
    // H2
    else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-[#e6edf3] mt-10 mb-4 pb-2 border-b border-[#30363d]">{line.slice(3)}</h2>)
    }
    // H3
    else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-semibold text-[#e6edf3] mt-8 mb-3">{line.slice(4)}</h3>)
    }
    // H4
    else if (line.startsWith('#### ')) {
      elements.push(<h4 key={i} className="text-lg font-semibold text-[#8b949e] mt-6 mb-2">{line.slice(5)}</h4>)
    }
    // Table
    else if (line.startsWith('|')) {
      const tableLines: string[] = [line]
      i++
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim())
      const rows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()))
      elements.push(
        <div key={i} className="overflow-x-auto my-6">
          <table className="w-full text-sm border border-[#30363d] rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#161b22]">
                {headers.map((h, j) => <th key={j} className="px-4 py-2 text-left text-[#8b949e] font-medium border-b border-[#30363d]">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, j) => (
                <tr key={j} className="border-b border-[#30363d]/50 hover:bg-[#161b22]/50">
                  {row.map((cell, k) => <td key={k} className="px-4 py-2 text-[#8b949e]">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }
    // List item
    else if (line.match(/^[-*] /)) {
      const items: string[] = [line.slice(2)]
      i++
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={i} className="my-4 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-[#8b949e]">
              <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
            </li>
          ))}
        </ul>
      )
      continue
    }
    // Numbered list
    else if (line.match(/^\d+\. /)) {
      const items: string[] = [line.replace(/^\d+\. /, '')]
      i++
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={i} className="my-4 space-y-2 list-none">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-[#8b949e]">
              <span className="text-blue-400 font-mono text-sm flex-shrink-0 mt-0.5">{j + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
            </li>
          ))}
        </ol>
      )
      continue
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-blue-500 pl-4 my-4 text-[#8b949e] italic">
          {line.slice(2)}
        </blockquote>
      )
    }
    // Horizontal rule
    else if (line === '---') {
      elements.push(<hr key={i} className="border-[#30363d] my-8" />)
    }
    // Empty line
    else if (line.trim() === '') {
      // skip
    }
    // Paragraph
    else {
      elements.push(
        <p key={i} className="text-[#8b949e] leading-relaxed my-3"
          dangerouslySetInnerHTML={{ __html: inlineMarkdown(line) }}
        />
      )
    }
    i++
  }

  return <div className="prose-dark">{elements}</div>
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#e6edf3] font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-[#161b22] border border-[#30363d] px-1.5 py-0.5 rounded text-sm text-blue-300 font-mono">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline underline-offset-2">$1</a>')
}
