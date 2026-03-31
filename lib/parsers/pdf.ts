import type { ParsedConversation } from '@/types/conversation'

export async function parsePDF(file: File): Promise<ParsedConversation[]> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const pdfParse = (await import('pdf-parse')).default
  const result = await pdfParse(buffer)

  const text = result.text.trim()
  if (text.length < 10) {
    throw new Error('PDF contains no readable text')
  }

  const { parseText } = await import('./text')
  return parseText(text)
}
