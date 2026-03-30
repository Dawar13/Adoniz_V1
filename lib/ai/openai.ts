import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

export const CHAT_MODEL = "gpt-4o-mini";
export const EMBED_MODEL = "text-embedding-3-small";
export const EMBED_DIMENSIONS = 1536;
