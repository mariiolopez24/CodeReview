import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, name?: string) {
  await resend.emails.send({
    from: 'CodeReview AI <noreply@yourdomain.com>',
    to: email,
    subject: 'Bienvenido a CodeReview AI',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f172a;">Bienvenido${name ? `, ${name}` : ''} 👋</h1>
        <p>Gracias por unirte a <strong>CodeReview AI</strong>.</p>
        <p>Tienes <strong>5 reviews gratuitos</strong> para empezar. No necesitas tarjeta de credito.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display:inline-block;background:#0f172a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">
          Hacer mi primer review →
        </a>
        <p style="color:#64748b;margin-top:32px;font-size:14px;">
          Si tienes alguna pregunta, responde este email directamente.
        </p>
      </div>
    `,
  })
}

export async function sendUpgradeConfirmationEmail(email: string, plan: string) {
  await resend.emails.send({
    from: 'CodeReview AI <noreply@yourdomain.com>',
    to: email,
    subject: `Plan ${plan} activado — CodeReview AI`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f172a;">Plan ${plan} activado ✅</h1>
        <p>Tu suscripcion al plan <strong>${plan}</strong> esta activa.</p>
        <p>Ahora tienes reviews <strong>ilimitados</strong> y acceso a todas las funciones premium.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display:inline-block;background:#0f172a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">
          Ir al dashboard →
        </a>
      </div>
    `,
  })
}
