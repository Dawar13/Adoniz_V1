import type { ParsedConversation } from '@/types/conversation'
import { parseCSV } from './csv'
import { parseJSON } from './json'
import { parseText } from './text'
import { parsePDF } from './pdf'

export async function parseFile(
  file: File | null,
  rawText: string | null
): Promise<ParsedConversation[]> {
  if (rawText && rawText.trim().length > 0) {
    return parseText(rawText)
  }

  if (!file) {
    throw new Error('No file or text provided')
  }

  const ext = file.name.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'csv':
      return parseCSV(file)
    case 'json':
      return parseJSON(file)
    case 'txt':
      return parseText(await file.text())
    case 'pdf':
      return parsePDF(file)
    default:
      throw new Error(`Unsupported file type: .${ext}`)
  }
}
