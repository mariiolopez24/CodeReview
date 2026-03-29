import Anthropic from '@anthropic-ai/sdk'
import type { ReviewResult } from '@/types'

export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function reviewCode(code: string, language: string = 'auto'): Promise<ReviewResult> {
  const prompt = `You are an expert code reviewer. Analyze the following ${language !== 'auto' ? language : ''} code and return a JSON object with this exact structure:

{
  "summary": "Brief overall assessment in 2-3 sentences",
  "score": <number 0-100>,
  "issues": [
    {
      "type": "error|warning|info",
      "line": <optional line number>,
      "message": "Description of the issue",
      "fix": "How to fix it"
    }
  ],
  "suggestions": [
    {
      "category": "Readability|Performance|Best Practices|Architecture",
      "message": "Suggestion description",
      "example": "Optional code example"
    }
  ],
  "security": [
    {
      "severity": "critical|high|medium|low",
      "message": "Security issue description",
      "fix": "How to fix it"
    }
  ],
  "performance": [
    {
      "message": "Performance note",
      "impact": "high|medium|low"
    }
  ]
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
