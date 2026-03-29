export interface GenerateArticleInput {
  title: string
  keywords: string[]
  targetLength?: 'short' | 'medium' | 'long'
}

export const INITIAL_ARTICLES: GenerateArticleInput[] = [
  {
    title: 'Qué es el Code Review y por qué es esencial en tu equipo',
    keywords: ['code review', 'revisión de código', 'qué es code review'],
    targetLength: 'medium',
  },
  {
    title: 'Cómo hacer un Code Review efectivo: guía completa',
    keywords: ['cómo hacer code review', 'code review efectivo', 'revisión de código efectiva'],
    targetLength: 'long',
  },
  {
    title: 'Code Review con Inteligencia Artificial: el futuro del desarrollo',
    keywords: ['code review ia', 'code review inteligencia artificial', 'ai code review'],
    targetLength: 'medium',
  },
  {
    title: 'Los 10 errores más comunes en Code Review y cómo evitarlos',
    keywords: ['errores code review', 'problemas revisión código', 'malas prácticas code review'],
    targetLength: 'medium',
  },
  {
    title: 'Code Review para Python: mejores prácticas y herramientas',
    keywords: ['code review python', 'revisar código python', 'herramientas code review python'],
    targetLength: 'medium',
  },
  {
    title: 'Code Review para JavaScript y TypeScript: guía práctica',
    keywords: ['code review javascript', 'code review typescript', 'revisar código javascript'],
    targetLength: 'medium',
  },
  {
    title: 'Cómo automatizar el Code Review en tu equipo de desarrollo',
    keywords: ['automatizar code review', 'code review automático', 'herramienta code review automatica'],
    targetLength: 'medium',
  },
  {
    title: 'Seguridad en el código: cómo detectar vulnerabilidades en el Code Review',
    keywords: ['seguridad code review', 'vulnerabilidades código', 'código seguro revisión'],
    targetLength: 'medium',
  },
  {
    title: 'OWASP Top 10: cómo detectar cada vulnerabilidad con Code Review',
    keywords: ['owasp top 10 code review', 'vulnerabilidades owasp', 'seguridad aplicaciones web'],
    targetLength: 'long',
  },
  {
    title: 'GitHub Copilot vs CodeReview AI: ¿cuál detecta más bugs de seguridad?',
    keywords: ['github copilot vs code review ai', 'alternativa github copilot', 'herramienta code review seguridad'],
    targetLength: 'medium',
  },
  {
    title: 'Cómo hacer Code Review de seguridad: checklist completo',
    keywords: ['code review seguridad checklist', 'seguridad code review', 'revisión código seguro'],
    targetLength: 'long',
  },
]
