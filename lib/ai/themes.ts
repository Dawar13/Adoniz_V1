import { openai } from './openai'

export interface ExtractedTheme {
  name: string
  count: number
  description: string
  severity: 'critical' | 'moderate' | 'low'
  sample_summaries: string[]
}

export async function extractThemes(
  summaries: { summary: string; category: string; sentiment: string }[]
): Promise<ExtractedTheme[]> {
  const summaryList = summaries
    .map((s, i) => `${i + 1}. [${s.category}] [${s.sentiment}] ${s.summary}`)
    .join('\n')

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You analyze batches of customer conversation summaries to identify recurring themes and patterns.

Given the summaries below, identify 5-10 distinct recurring themes.

Return ONLY valid JSON, no markdown, no backticks:
{
  "themes": [
    {
      "name": "short name (3-6 words)",
      "count": number_of_conversations_related,
      "description": "one sentence explaining the pattern",
      "severity": "critical" | "moderate" | "low",
      "sample_summaries": ["summary1", "summary2", "summary3"]
    }
  ]
}

Severity guide:
- critical: affects core functionality, many users impacted, or churn risk
- moderate: notable issue but workarounds exist
- low: minor inconvenience or nice-to-have request`,
      },
      {
        role: 'user',
        content: `Here are ${summaries.length} conversation summaries:\n\n${summaryList}`,
      },
    ],
    max_tokens: 2000,
  })

  try {
    const raw = response.choices[0]?.message?.content?.trim() || ''
    const parsed = JSON.parse(raw)
    return parsed.themes || []
  } catch {
    return []
  }
}
