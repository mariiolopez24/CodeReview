import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { reviewCode } from '@/lib/claude'
import { canReview } from '@/lib/utils'
import { sendConversionEmail } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (!canReview(profile.reviews_used, profile.plan)) {
      return NextResponse.json(
        { error: 'Review limit reached. Upgrade to Pro for unlimited reviews.' },
        { status: 403 }
      )
    }

    const { code, language = 'auto' } = await request.json()

    if (!code || code.trim().length < 10) {
      return NextResponse.json({ error: 'Code is too short' }, { status: 400 })
    }

    if (code.length > 50000) {
      return NextResponse.json({ error: 'Code is too long (max 50,000 chars)' }, { status: 400 })
    }

    // Detect user locale from cookie or Accept-Language header
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
    const acceptLang = request.headers.get('accept-language') ?? ''
    const browserLang = acceptLang.split(',')[0]?.split('-')[0]?.toLowerCase()
    const locale = localeCookie ?? (['es', 'en'].includes(browserLang) ? browserLang : 'es')

    const result = await reviewCode(code, language, locale)

    // Save review and increment counter
    const { data: review } = await supabase
      .from('reviews')
      .insert({ user_id: user.id, code, language, result })
      .select()
      .single()

    const newCount = profile.reviews_used + 1
    await supabase
      .from('profiles')
      .update({ reviews_used: newCount })
      .eq('id', user.id)

    // Send conversion email at 3rd review (fire-and-forget)
    if (newCount === 3 && profile.plan === 'free') {
      sendConversionEmail(user.email!).catch(() => {})
    }

    return NextResponse.json({ review, result })
  } catch (error) {
    console.error('Review error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
