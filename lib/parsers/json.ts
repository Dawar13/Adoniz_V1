import type { ParsedConversation } from '@/types/conversation'

export async function parseJSON(file: File): Promise<ParsedConversation[]> {
  const text = await file.text()
  const data = JSON.parse(text)

  if (Array.isArray(data)) {
    return data.map(item => parseJSONItem(item)).filter(Boolean) as ParsedConversation[]
  }

  if (data.conversations && Array.isArray(data.conversations)) {
    return data.conversations.map((item: Record<string, unknown>) => parseJSONItem(item)).filter(Boolean) as ParsedConversation[]
  }

  if (data.messages && Array.isArray(data.messages)) {
    const text = data.messages
      .map((m: Record<string, string>) => `${m.user || 'Unknown'}: ${m.text || ''}`)
      .join('\n')
    return [{ raw_text: text }]
  }

  const single = parseJSONItem(data)
  if (single) return [single]

  throw new Error('Could not parse JSON format. Expected an array of conversations or {conversations: [...]}')
}

function parseJSONItem(item: Record<string, unknown>): ParsedConversation | null {
  let rawText = ''

  if (typeof item.conversation === 'string') {
    rawText = item.conversation
  } else if (typeof item.text === 'string') {
    rawText = item.text
  } else if (typeof item.body === 'string') {
    rawText = item.body
  } else if (typeof item.content === 'string') {
    rawText = item.content
  } else if (typeof item.transcript === 'string') {
    rawText = item.transcript
  } else if (Array.isArray(item.messages)) {
    rawText = (item.messages as Record<string, string>[])
      .map(m => {
        const role = m.role || m.from || m.sender || m.user || 'Unknown'
        const content = m.content || m.text || m.body || m.message || ''
        return `${role}: ${content}`
      })
      .join('\n')
  }

  if (!rawText || rawText.trim().length < 10) return null

  return {
    raw_text: rawText.trim(),
    external_id: (item.id || item.conversation_id || item.ticket_id || '') as string || undefined,
    conversation_date: (item.date || item.created_at || item.timestamp || '') as string || undefined,
  }
}
