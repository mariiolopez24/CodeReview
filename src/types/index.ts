export type Plan = 'free' | 'pro' | 'team'

export interface User {
  id: string
  email: string
  plan: Plan
  reviews_used: number
  reviews_limit: number
  stripe_customer_id?: string
  stripe_subscription_id?: string
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  code: string
  language: string
  result: ReviewResult
  created_at: string
}

export interface ReviewResult {
  summary: string
  score: number
  issues: Issue[]
  suggestions: Suggestion[]
  security: SecurityIssue[]
  performance: PerformanceNote[]
}

export interface Issue {
  type: 'error' | 'warning' | 'info'
  line?: number
  message: string
  fix?: string
}

export interface Suggestion {
  category: string
  message: string
  example?: string
}

export interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low'
  message: string
  fix: string
}

export interface PerformanceNote {
  message: string
  impact: 'high' | 'medium' | 'low'
}

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    reviews: 5,
    features: ['5 reviews por mes', 'Lenguajes principales', 'Reporte básico'],
  },
  pro: {
    name: 'Pro',
    price: 12,
    reviews: -1,
    features: [
      'Reviews ilimitados',
      'Todos los lenguajes',
      'Reporte completo + seguridad',
      'Historial de reviews',
      'Soporte prioritario',
    ],
  },
  team: {
    name: 'Team',
    price: 39,
    reviews: -1,
    features: [
      'Todo lo de Pro',
      'Hasta 5 usuarios',
      'Dashboard compartido',
      'API access',
      'Onboarding dedicado',
    ],
  },
}
