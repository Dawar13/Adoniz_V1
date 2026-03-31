import type { ParsedConversation } from '@/types/conversation'

export function parseText(text: string): ParsedConversation[] {
  const cleaned = text.trim()
  if (cleaned.length < 10) {
    throw new Error('Text is too short to contain conversations')
  }

  const delimiters = [
    /\n---+\n/,
    /\n={3,}\n/,
    /\n\*{3,}\n/,
    /\n#{2,}\s/,
    /\n(?=Conversation\s*#?\d)/i,
    /\n(?=Chat\s*#?\d)/i,
    /\n(?=Ticket\s*#?\d)/i,
  ]

  for (const delimiter of delimiters) {
    const parts = cleaned.split(delimiter).filter(p => p.trim().length > 10)
    if (parts.length > 1) {
      return parts.map(part => ({
        raw_text: part.trim(),
      }))
    }
  }

  if (cleaned.length > 1000) {
    const paragraphs = cleaned.split(/\n\s*\n/).filter(p => p.trim().length > 30)
    if (paragraphs.length > 1) {
      return paragraphs.map(p => ({ raw_text: p.trim() }))
    }
  }

  return [{ raw_text: cleaned }]
}
