import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'CodeReview AI <hola@codereview.codes>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.codereview.codes'

export async function sendWelcomeEmail(email: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Bienvenido a CodeReview AI — 5 análisis gratis te esperan',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e6edf3;padding:32px 24px;border-radius:12px;">
        <h1 style="color:#e6edf3;margin-top:0;">Bienvenido a CodeReview AI 👋</h1>
        <p style="color:#8b949e;line-height:1.6;">Tienes <strong style="color:#e6edf3;">5 análisis gratis</strong> para empezar. No necesitas tarjeta de crédito.</p>
        <p style="color:#8b949e;line-height:1.6;">Con cada análisis detectarás:</p>
        <ul style="color:#8b949e;line-height:2;">
          <li>🔒 Vulnerabilidades OWASP Top 10 (SQL Injection, XSS, CSRF...)</li>
          <li>🐛 Bugs y errores de lógica</li>
          <li>⚡ Problemas de rendimiento</li>
          <li>📖 Mejoras de legibilidad y arquitectura</li>
        </ul>
        <a href="${APP_URL}/dashboard"
           style="display:inline-block;background:#2563eb;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;margin-top:8px;font-weight:600;">
          Hacer mi primer análisis →
        </a>
        <p style="color:#484f58;margin-top:32px;font-size:13px;">
          Si tienes alguna pregunta, responde este email directamente.
        </p>
      </div>
    `,
  })
}

export async function sendConversionEmail(email: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Ya has hecho 3 análisis — ¿listo para análisis ilimitados?',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e6edf3;padding:32px 24px;border-radius:12px;">
        <h1 style="color:#e6edf3;margin-top:0;">Ya llevas 3 análisis 🎯</h1>
        <p style="color:#8b949e;line-height:1.6;">Estás detectando vulnerabilidades reales en tu código. Bien hecho.</p>
        <p style="color:#8b949e;line-height:1.6;">Te quedan <strong style="color:#f59e0b;">2 análisis gratuitos</strong>. Con Pro, tendrás análisis ilimitados por solo <strong style="color:#e6edf3;">$12/mes</strong>.</p>
        <div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="color:#e6edf3;font-weight:600;margin:0 0 12px;">Plan Pro — $12/mes</p>
          <ul style="color:#8b949e;line-height:2;margin:0;padding-left:20px;">
            <li>✅ Análisis ilimitados</li>
            <li>✅ OWASP Top 10 completo</li>
            <li>✅ Historial de análisis</li>
            <li>✅ Todos los lenguajes</li>
          </ul>
        </div>
        <a href="${APP_URL}/pricing"
           style="display:inline-block;background:#2563eb;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
          Ver planes →
        </a>
        <p style="color:#484f58;margin-top:24px;font-size:13px;">7 días de garantía de devolución. Cancela cuando quieras.</p>
      </div>
    `,
  })
}

export async function sendReactivationEmail(email: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Te echamos de menos — tus análisis gratuitos siguen aquí',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e6edf3;padding:32px 24px;border-radius:12px;">
        <h1 style="color:#e6edf3;margin-top:0;">¿Código sin revisar? 🔍</h1>
        <p style="color:#8b949e;line-height:1.6;">Han pasado 2 semanas desde tu último análisis. Tus análisis gratuitos siguen esperándote.</p>
        <p style="color:#8b949e;line-height:1.6;">Recuerda que CodeReview AI detecta en segundos:</p>
        <ul style="color:#8b949e;line-height:2;">
          <li>SQL Injection y vulnerabilidades OWASP</li>
          <li>Bugs antes de llegar a producción</li>
          <li>Problemas de rendimiento</li>
        </ul>
        <a href="${APP_URL}/dashboard"
           style="display:inline-block;background:#2563eb;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;margin-top:8px;font-weight:600;">
          Volver a analizar →
        </a>
        <p style="color:#484f58;margin-top:32px;font-size:13px;">
          <a href="${APP_URL}/unsubscribe" style="color:#484f58;">Cancelar suscripción a emails</a>
        </p>
      </div>
    `,
  })
}

export async function sendUpgradeConfirmationEmail(email: string, plan: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Plan ${plan} activado — CodeReview AI`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e6edf3;padding:32px 24px;border-radius:12px;">
        <h1 style="color:#e6edf3;margin-top:0;">Plan ${plan} activado ✅</h1>
        <p style="color:#8b949e;line-height:1.6;">Tu suscripción al plan <strong style="color:#e6edf3;">${plan}</strong> está activa.</p>
        <p style="color:#8b949e;line-height:1.6;">Ahora tienes análisis <strong style="color:#e6edf3;">ilimitados</strong> y acceso completo a todas las funciones premium.</p>
        <a href="${APP_URL}/dashboard"
           style="display:inline-block;background:#2563eb;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;margin-top:8px;font-weight:600;">
          Ir al dashboard →
        </a>
        <p style="color:#484f58;margin-top:32px;font-size:13px;">¿Necesitas ayuda? Responde este email.</p>
      </div>
    `,
  })
}
