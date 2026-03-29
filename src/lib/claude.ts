import Anthropic from '@anthropic-ai/sdk'
import type { ReviewResult } from '@/types'

export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const LANG_NAMES: Record<string, string> = {
  es: 'español',
  en: 'English',
  fr: 'français',
  de: 'Deutsch',
  pt: 'português',
  it: 'italiano',
}

export async function reviewCode(code: string, language: string = 'auto', locale: string = 'es'): Promise<ReviewResult> {
  const langName = LANG_NAMES[locale] ?? 'español'
  const isEs = locale === 'es'

  const prompt = isEs
    ? `Eres un experto revisor de código. Analiza el siguiente código${language !== 'auto' ? ` en ${language}` : ''} y devuelve un objeto JSON con esta estructura exacta. Responde siempre en español:

{
  "summary": "Valoración general en 2-3 frases",
  "score": <número 0-100>,
  "issues": [{ "type": "error|warning|info", "line": <opcional>, "message": "Descripción del problema", "fix": "Cómo solucionarlo" }],
  "suggestions": [{ "category": "Legibilidad|Rendimiento|Buenas Prácticas|Arquitectura", "message": "Descripción", "example": "Ejemplo opcional" }],
  "security": [{ "severity": "critical|high|medium|low", "message": "Problema de seguridad", "fix": "Solución" }],
  "performance": [{ "message": "Nota de rendimiento", "impact": "high|medium|low" }]
}

Devuelve ÚNICAMENTE el JSON, sin markdown, sin explicaciones.

Código a revisar:
\`\`\`
${code}
\`\`\``
    : `You are an expert code reviewer. Analyze the following${language !== 'auto' ? ` ${language}` : ''} code and return a JSON object. Respond in ${langName}:

{
  "summary": "Overall assessment in 2-3 sentences",
  "score": <number 0-100>,
  "issues": [{ "type": "error|warning|info", "line": <optional>, "message": "Issue description", "fix": "How to fix it" }],
  "suggestions": [{ "category": "Readability|Performance|Best Practices|Architecture", "message": "Description", "example": "Optional example" }],
  "security": [{ "severity": "critical|high|medium|low", "message": "Security issue", "fix": "Fix" }],
  "performance": [{ "message": "Performance note", "impact": "high|medium|low" }]
}

Return ONLY the JSON, no markdown, no explanation.

Code to review:
\`\`\`
${code}
\`\`\``

  const message = await anthropicClient.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  try {
    let text = content.text.trim()
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    }
    return JSON.parse(text) as ReviewResult
  } catch {
    throw new Error('Failed to parse review result')
  }
}
