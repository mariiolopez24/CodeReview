import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateArticle, type GenerateArticleInput } from '@/lib/blog'
import { checkIsAdmin } from '@/lib/supabase/check-admin'

export async function POST(request: NextRequest) {
  if (!(await checkIsAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: GenerateArticleInput & { publish?: boolean } = await request.json()

  if (!body.title || !body.keywords?.length) {
    return NextResponse.json({ error: 'title and keywords are required' }, { status: 400 })
  }

  try {
    console.log('[DEBUG] ANTHROPIC_API_KEY present:', !!process.env.ANTHROPIC_API_KEY, '| starts with:', process.env.ANTHROPIC_API_KEY?.slice(0, 15))
    const article = await generateArticle({
      title: body.title,
      keywords: body.keywords,
      targetLength: body.targetLength ?? 'medium',
    })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let slug = article.slug
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('slug', slug)
      .single()

    if (existing) slug = `${slug}-${Date.now()}`

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({ ...article, slug, published: body.publish ?? false })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('[BLOG GENERATE] Error completo:', JSON.stringify(error, null, 2))
    const msg = error instanceof Error
      ? `${error.message} — ${(error as NodeJS.ErrnoException).code ?? ''}`
      : String(error)
    return NextResponse.json({ error: msg, detail: error }, { status: 500 })
  }
}
