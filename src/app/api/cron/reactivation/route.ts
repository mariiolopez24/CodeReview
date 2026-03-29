import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendReactivationEmail } from '@/lib/resend'

// Run daily via Vercel Cron — configure in vercel.json
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Find free users who haven't reviewed in 14 days
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 14)

  const { data: users } = await supabase
    .from('profiles')
    .select('id, email:id')
    .eq('plan', 'free')
    .lt('last_review_at', cutoff.toISOString())
    .not('last_review_at', 'is', null)

  if (!users) return NextResponse.json({ sent: 0 })

  let sent = 0
  for (const user of users) {
    const { data: authUser } = await supabase.auth.admin.getUserById(user.id)
    if (authUser?.user?.email) {
      await sendReactivationEmail(authUser.user.email).catch(() => {})
      sent++
    }
  }

  return NextResponse.json({ sent })
}
