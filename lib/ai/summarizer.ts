import { openai } from './openai'

export async function summarizeConversation(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `Summarize this customer support conversation in ONE sentence.
Maximum 20 words. Focus on the core issue, request, or outcome.
Be specific — not "customer had an issue" but "customer reported checkout widget failing on Safari mobile".
Return ONLY the summary sentence, nothing else.`,
      },
      { role: 'user', content: text },
    ],
    max_tokens: 60,
  })

  return response.choices[0]?.message?.content?.trim() || 'Unable to generate summary'
}
