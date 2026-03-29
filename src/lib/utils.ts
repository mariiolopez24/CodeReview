import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getReviewsLimit(plan: string): number {
  if (plan === 'pro' || plan === 'team') return -1 // unlimited
  return 5
}

export function canReview(reviewsUsed: number, plan: string): boolean {
  const limit = getReviewsLimit(plan)
  if (limit === -1) return true
  return reviewsUsed < limit
}

export function detectLanguage(code: string): string {
  if (code.includes('import React') || code.includes('jsx') || code.includes('tsx')) return 'React/JSX'
  if (code.includes('def ') && code.includes(':')) return 'Python'
  if (code.includes('fn ') && code.includes('->')) return 'Rust'
  if (code.includes('func ') && code.includes('package ')) return 'Go'
  if (code.includes('class ') && code.includes(';')) return 'Java/C#'
  if (code.includes('const ') || code.includes('let ') || code.includes('=>')) return 'JavaScript/TypeScript'
  return 'Unknown'
}
