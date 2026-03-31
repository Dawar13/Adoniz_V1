import { openai } from './openai'

// PASS 1: Regex — catches structured PII patterns
function regexSanitize(text: string): string {
  let result = text

  // Email addresses
  result = result.replace(/\b[\w.-]+@[\w.-]+\.\w{2,}\b/g, '[EMAIL]')

  // URLs
  result = result.replace(/https?:\/\/\S+/g, '[URL]')

  // Phone numbers (various formats)
  result = result.replace(/\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[PHONE]')

  // IP addresses
  result = result.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]')

  // Credit card numbers (basic pattern)
  result = result.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD]')

  // SSN pattern
  result = result.replace(/\b\d{3}[-]?\d{2}[-]?\d{4}\b/g, '[SSN]')

  return result
}

// PASS 2: AI — catches contextual PII that regex misses
async function aiSanitize(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are a data sanitization tool. Remove ALL personally identifiable information from the text below.

Replace with these exact placeholders:
- Customer names → [CUSTOMER]
- Agent/support staff names → [AGENT]
- Store names / brand names / company names → [STORE]
- Store URLs / website URLs not already replaced → [URL]
- Email addresses not already replaced → [EMAIL]
- Phone numbers not already replaced → [PHONE]
- Subscription IDs / Order IDs / Account IDs → [ID]
- Payment info (card numbers, etc.) → [PAYMENT]
- Physical addresses → [ADDRESS]
- Any other identifying information → [REDACTED]

IMPORTANT:
- Preserve the conversation structure, tone, and meaning completely.
- Only remove PII — do not rephrase or summarize.
- If text already has placeholders like [EMAIL], leave them as-is.
- Return ONLY the sanitized text, nothing else.`,
      },
      { role: 'user', content: text },
    ],
    max_tokens: 2000,
  })

  return response.choices[0]?.message?.content?.trim() || text
}

// Combined sanitizer — regex first (fast, free), then AI (thorough)
export async function sanitizeText(rawText: string): Promise<string> {
  const afterRegex = regexSanitize(rawText)
  const afterAI = await aiSanitize(afterRegex)
  return afterAI
}
