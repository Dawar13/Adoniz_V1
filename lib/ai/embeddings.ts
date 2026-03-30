import { getOpenAI, EMBED_MODEL, EMBED_DIMENSIONS } from "./openai";

export async function embed(text: string): Promise<number[]> {
  const openai = getOpenAI();

  const response = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: text.slice(0, 8000),
    dimensions: EMBED_DIMENSIONS,
  });

  return response.data[0]?.embedding ?? [];
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const openai = getOpenAI();
  const truncated = texts.map((t) => t.slice(0, 8000));

  const response = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: truncated,
    dimensions: EMBED_DIMENSIONS,
  });

  return response.data.map((d) => d.embedding);
}
