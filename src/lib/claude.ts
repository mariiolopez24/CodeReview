import Anthropic from '@anthropic-ai/sdk'
import type { ReviewResult } from '@/types'

export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function reviewCode(code: string, language: string = 'auto'): Promise<ReviewResult> {
  const prompt = `Eres un experto revisor de código. Analiza el siguiente código${language !== 'auto' ? ` en ${language}` : ''} y devuelve un objeto JSON con esta estructura exacta. Responde siempre en español, independientemente del idioma del código:

{
  "summary": "Valoración general en 2-3 frases en español",
  "score": <número 0-100>,
  "issues": [
    {
      "type": "error|warning|info",
      "line": <número de línea opcional>,
      "message": "Descripción del problema en español",
      "fix": "Cómo solucionarlo en español"
    }
  ],
  "suggestions": [
    {
      "category": "Legibilidad|Rendimiento|Buenas Prácticas|Arquitectura",
      "message": "Descripción de la sugerencia en español",
      "example": "Ejemplo de código opcional"
    }
  ],
  "security": [
    {
      "severity": "critical|high|medium|low",
      "message": "Descripción del problema de seguridad en español",
      "fix": "Cómo solucionarlo en español"
    }
  ],
  "performance": [
    {
      "message": "Nota de rendimiento en español",
      "impact": "high|medium|low"
    }
  ]
}

Devuelve ÚNICAMENTE el JSON, sin markdown, sin explicaciones.

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
