// Server-only — never import this file from client components
import { anthropicClient } from './claude'
import type { GenerateArticleInput } from './blog-topics'

export type { GenerateArticleInput }
export { INITIAL_ARTICLES } from './blog-topics'

export interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  content: string
  keywords: string[]
  reading_time: number
  published: boolean
  created_at: string
}

export async function generateArticle(input: GenerateArticleInput): Promise<{
  slug: string
  title: string
  description: string
  content: string
  keywords: string[]
  reading_time: number
}> {
  const wordTarget = input.targetLength === 'short' ? 800
    : input.targetLength === 'long' ? 2500
    : 1500

  const prompt = `Eres un experto en desarrollo de software y SEO. Escribe un artículo completo en español para el blog de "CodeReview AI", una herramienta SaaS de revisión de código con inteligencia artificial.

TÍTULO: ${input.title}
KEYWORDS OBJETIVO: ${input.keywords.join(', ')}
LONGITUD OBJETIVO: ~${wordTarget} palabras

INSTRUCCIONES:
- Escribe en markdown limpio y bien estructurado
- Usa H2 (##) y H3 (###) para secciones
- Incluye ejemplos de código reales y útiles en bloques de código
- El tono es profesional pero cercano, en español
- Menciona naturalmente "CodeReview AI" 2-3 veces como solución
- Incluye una llamada a la acción al final que lleve a /signup
- NO incluyas el título H1 en el contenido (se añade por separado)
- Usa listas, tablas y ejemplos para que sea fácil de leer
- Asegúrate de que responde EXACTAMENTE la intención de búsqueda de las keywords

Al FINAL del artículo, después de "---", devuelve un JSON con este formato EXACTO:
{
  "slug": "url-amigable-del-articulo",
  "description": "Meta descripción SEO de 150-160 caracteres",
  "reading_time": 5
}

IMPORTANTE: El JSON debe estar después del separador --- y ser válido.`

  const message = await anthropicClient.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  const parts = raw.split(/\n---\n/)
  const content = parts[0].trim()

  let slug = ''
  let description = ''
  let reading_time = Math.ceil(wordTarget / 200)

  if (parts[1]) {
    try {
      const jsonMatch = parts[1].match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const meta = JSON.parse(jsonMatch[0])
        slug = meta.slug || slugify(input.title)
        description = meta.description || ''
        reading_time = meta.reading_time || reading_time
      }
    } catch {
      slug = slugify(input.title)
    }
  } else {
    slug = slugify(input.title)
  }

  return { slug, title: input.title, description, content, keywords: input.keywords, reading_time }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
