import Papa from 'papaparse'
import type { ParsedConversation } from '@/types/conversation'

export async function parseCSV(file: File): Promise<ParsedConversation[]> {
  const text = await file.text()

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const conversations: ParsedConversation[] = []

        for (const row of results.data as Record<string, string>[]) {
          const rawText =
            row['conversation'] ||
            row['text'] ||
            row['message'] ||
            row['content'] ||
            row['body'] ||
            row['transcript'] ||
            row['chat'] ||
            Object.values(row).join(' ')

          if (!rawText || rawText.trim().length < 10) continue

          conversations.push({
            raw_text: rawText.trim(),
            external_id: row['id'] || row['conversation_id'] || row['ticket_id'] || undefined,
            conversation_date:
              row['date'] || row['created_at'] || row['timestamp'] || undefined,
            participants: extractParticipants(row),
          })
        }

        if (conversations.length === 0) {
          reject(new Error('No conversations found in CSV. Make sure there is a column with conversation text.'))
        } else {
          resolve(conversations)
        }
      },
      error: (err: Error) => reject(new Error(`CSV parse error: ${err.message}`)),
    })
  })
}

function extractParticipants(row: Record<string, string>) {
  const participants: { role: string; name: string }[] = []
  if (row['customer'] || row['customer_name']) {
    participants.push({ role: 'customer', name: row['customer'] || row['customer_name'] })
  }
  if (row['agent'] || row['agent_name'] || row['support']) {
    participants.push({ role: 'agent', name: row['agent'] || row['agent_name'] || row['support'] })
  }
  return participants.length > 0 ? participants : undefined
}
