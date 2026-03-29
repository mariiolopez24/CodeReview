import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad y Tratamiento de Datos — CodeReview AI',
  description: 'Información sobre cómo recopilamos, usamos y protegemos tus datos personales en CodeReview AI.',
}

const sections = [
  {
    title: '1. Responsable del tratamiento',
    content: `CodeReview AI es el responsable del tratamiento de los datos personales que nos facilites a través de este sitio web. Puedes contactarnos en cualquier momento a través del email de soporte para ejercer tus derechos o resolver cualquier duda sobre el tratamiento de tus datos.`,
  },
  {
    title: '2. Datos que recopilamos',
    content: `Recopilamos únicamente los datos necesarios para prestar el servicio:

• Email y contraseña: para crear y gestionar tu cuenta de usuario.
• Código fuente que envías para análisis: se procesa en tiempo real y se almacena en nuestros servidores para mostrar tu historial de reviews. No se utiliza para entrenar modelos de IA.
• Datos de pago: gestionados íntegramente por Stripe. No almacenamos datos de tarjeta en nuestros servidores.
• Datos de uso: número de reviews realizados y plan contratado.`,
  },
  {
    title: '3. Finalidad del tratamiento',
    content: `Utilizamos tus datos para:

• Prestación del servicio de análisis de código mediante inteligencia artificial.
• Gestión de tu cuenta y autenticación.
• Procesamiento de pagos y gestión de suscripciones.
• Envío de comunicaciones relacionadas con el servicio (confirmaciones, alertas de cuenta).
• Mejora y mantenimiento de la plataforma.`,
  },
  {
    title: '4. Base legal',
    content: `El tratamiento de tus datos se basa en:

• Ejecución del contrato: para prestarte el servicio que has solicitado al crear tu cuenta.
• Interés legítimo: para el mantenimiento de la seguridad y correcto funcionamiento del servicio.
• Consentimiento: para el envío de comunicaciones opcionales de marketing, que podrás revocar en cualquier momento.`,
  },
  {
    title: '5. Tu código fuente',
    content: `El código que envías para análisis es procesado por la API de Anthropic (Claude AI). Debes saber que:

• Tu código se transmite de forma cifrada (HTTPS) a los servidores de Anthropic para su análisis.
• No utilizamos tu código para entrenar ni mejorar modelos de IA propios.
• Recomendamos no enviar código que contenga credenciales, contraseñas, tokens de acceso ni datos personales de terceros.
• Puedes eliminar tu historial de reviews en cualquier momento desde tu cuenta.`,
  },
  {
    title: '6. Conservación de datos',
    content: `• Datos de cuenta: se conservan mientras mantengas tu cuenta activa. Si eliminas tu cuenta, tus datos se borran en un plazo máximo de 30 días.
• Historial de reviews: disponible mientras tu cuenta esté activa. Puedes eliminarlo manualmente en cualquier momento.
• Datos de facturación: conservados durante el tiempo exigido por la legislación fiscal aplicable (mínimo 5 años).`,
  },
  {
    title: '7. Tus derechos',
    content: `Tienes derecho a:

• Acceso: conocer qué datos tenemos sobre ti.
• Rectificación: corregir datos inexactos o incompletos.
• Supresión: solicitar la eliminación de tus datos ("derecho al olvido").
• Portabilidad: recibir tus datos en un formato estructurado y legible.
• Oposición y limitación: oponerte a ciertos tratamientos o solicitar que los limitemos.

Para ejercer cualquiera de estos derechos, contáctanos por email. Responderemos en un plazo máximo de 30 días.`,
  },
  {
    title: '8. Seguridad',
    content: `Aplicamos medidas técnicas y organizativas para proteger tus datos:

• Todas las comunicaciones están cifradas con TLS/HTTPS.
• Las contraseñas se almacenan con hash seguro (bcrypt).
• Acceso restringido a los datos mediante autenticación y control de roles.
• Revisiones periódicas de seguridad.`,
  },
  {
    title: '9. Terceros y transferencias',
    content: `Utilizamos los siguientes proveedores de servicio que pueden acceder a tus datos en la medida necesaria para prestar sus servicios:

• Supabase: almacenamiento de datos y autenticación (infraestructura en la UE).
• Anthropic: procesamiento del código para análisis de IA.
• Stripe: procesamiento de pagos (certificado PCI DSS).
• Resend: envío de emails transaccionales.

No vendemos ni cedemos tus datos a terceros con fines publicitarios.`,
  },
  {
    title: '10. Cambios en esta política',
    content: `Podemos actualizar esta política ocasionalmente. Te notificaremos por email sobre cambios significativos. La fecha de última actualización se indica al pie de esta página. El uso continuado del servicio tras los cambios implica tu aceptación de la nueva política.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <nav className="border-b border-[#30363d] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-[#e6edf3] text-xl">
            CodeReview <span className="text-blue-400">AI</span>
          </Link>
          <Link href="/signup" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
            Empezar gratis
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-[#e6edf3] mb-2">
          Política de Privacidad y Tratamiento de Datos
        </h1>
        <p className="text-[#8b949e] mb-12">
          Última actualización: marzo 2026
        </p>

        <div className="prose prose-invert max-w-none space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-[#e6edf3] mb-3 pb-2 border-b border-[#30363d]">
                {section.title}
              </h2>
              <p className="text-[#8b949e] text-sm leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 bg-[#161b22] border border-[#30363d] rounded-xl">
          <h2 className="text-[#e6edf3] font-semibold mb-2">¿Tienes preguntas sobre tus datos?</h2>
          <p className="text-[#8b949e] text-sm mb-4">
            Puedes contactarnos en cualquier momento y responderemos en un plazo máximo de 48 horas.
          </p>
          <Link
            href="mailto:privacy@codereviewai.com"
            className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
          >
            Contactar sobre privacidad
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#30363d] px-6 py-8 mt-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[#484f58] text-sm">
          <span>© 2026 CodeReview AI</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-[#8b949e] transition-colors">Precios</Link>
            <Link href="/" className="hover:text-[#8b949e] transition-colors">Inicio</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
