import { openai } from './openai'

// Generate embedding for a single text
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000),
  })

  return response.data[0].embedding
}

// Generate embeddings for multiple texts in one API call (more efficient)
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const trimmed = texts.map(t => t.slice(0, 8000))

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: trimmed,
  })

  return response.data.map(d => d.embedding)
}
