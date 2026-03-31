import { openai } from './openai'
import type { Category } from '@/types/conversation'

interface CategoryResult {
  category: Category
  confidence: number
}

export async function categorizeConversation(text: string): Promise<CategoryResult> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `Categorize this customer support conversation into exactly ONE category.

Categories:
- bug: Something is broken, erroring, or not working as expected
- feature_request: Customer asks for new functionality or improvements
- escalation: Customer is very upset, demands manager, threatens to leave
- billing: Questions or issues about charges, invoices, subscriptions, pricing
- onboarding: New customer needs help setting up or getting started
- general: General questions, how-to, usage guidance
- praise: Customer expressing satisfaction, thanks, positive feedback
- churn_signal: Customer mentions canceling, leaving, switching to competitor

Return ONLY valid JSON, no markdown, no backticks:
{"category": "one_of_above", "confidence": 0.0-1.0}`,
      },
      { role: 'user', content: text },
    ],
    max_tokens: 100,
  })

  try {
    const raw = response.choices[0]?.message?.content?.trim() || ''
    const parsed = JSON.parse(raw)
    return {
      category: parsed.category as Category,
      confidence: Math.max(0, Math.min(1, parsed.confidence)),
    }
  } catch {
    return { category: 'general', confidence: 0.5 }
  }
}
