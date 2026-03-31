import { openai } from './openai'
import type { Sentiment } from '@/types/conversation'

interface SentimentResult {
  sentiment: Sentiment
  score: number
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You analyze customer support conversations for sentiment.
Classify the CUSTOMER's overall sentiment (not the agent's).
Consider the entire conversation arc — a frustrated customer who gets help and ends satisfied is "positive".

Return ONLY valid JSON, no markdown, no backticks:
{"sentiment": "positive" | "neutral" | "negative", "score": 0.0-1.0}

Score guide: 1.0 = extremely positive, 0.5 = perfectly neutral, 0.0 = extremely negative.`,
      },
      { role: 'user', content: text },
    ],
    max_tokens: 100,
  })

  try {
    const raw = response.choices[0]?.message?.content?.trim() || ''
    const parsed = JSON.parse(raw)
    return {
      sentiment: parsed.sentiment as Sentiment,
      score: Math.max(0, Math.min(1, parsed.score)),
    }
  } catch {
    return { sentiment: 'neutral', score: 0.5 }
  }
}
