import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/resend'

// Supabase Auth webhook for new user signups
// Configure in Supabase Dashboard → Authentication → Hooks
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Supabase sends { type: 'INSERT', table: 'users', record: {...} }
  if (body.type === 'INSERT' && body.table === 'users' && body.record?.email) {
    sendWelcomeEmail(body.record.email).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
