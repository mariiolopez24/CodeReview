import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  let email: string, source: string
  try {
    const body = await request.json()
    email = body.email
    source = body.source
  } catch {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email: email.toLowerCase(), source: source ?? 'site' }, { onConflict: 'email' })

  if (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  // Send welcome email via Resend
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CodeReview AI <noreply@codereview-ai.com>',
        to: email,
        subject: 'Bienvenido a los tips de CodeReview AI',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e6edf3;padding:40px 32px;border-radius:12px">
            <h1 style="color:#e6edf3;font-size:24px;margin-bottom:8px">¡Gracias por suscribirte! 👋</h1>
            <p style="color:#8b949e;line-height:1.6">Recibirás tips semanales sobre code review, seguridad y buenas prácticas de desarrollo.</p>
            <p style="color:#8b949e;line-height:1.6">Mientras tanto, prueba <a href="https://codereview-ai.com" style="color:#58a6ff">CodeReview AI gratis</a> y detecta vulnerabilidades en tu código en segundos.</p>
            <hr style="border:none;border-top:1px solid #30363d;margin:24px 0">
            <p style="color:#484f58;font-size:12px">Puedes cancelar la suscripción en cualquier momento respondiendo a este email.</p>
          </div>
        `,
      }),
    })
  } catch {
    // Welcome email failure is non-blocking
  }

  return NextResponse.json({ ok: true })
}
