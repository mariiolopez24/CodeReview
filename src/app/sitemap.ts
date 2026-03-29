import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://codereview-ai.com'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const blogUrls: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: base,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/pricing`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/comparar`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog`,        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/signup`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/login`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`,     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    ...blogUrls,
  ]
}
