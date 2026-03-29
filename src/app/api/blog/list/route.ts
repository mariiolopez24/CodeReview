import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkIsAdmin } from '@/lib/supabase/check-admin'

export async function GET() {
  if (!(await checkIsAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, published, reading_time, created_at')
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}
