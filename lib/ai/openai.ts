import OpenAI from 'openai'

// Singleton — reused across all AI functions
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const CHAT_MODEL = 'gpt-4o'
