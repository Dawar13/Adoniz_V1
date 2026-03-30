import { getOpenAI, CHAT_MODEL } from "./openai";

const SYSTEM_PROMPT = `You are a concise summarizer for customer support conversations.
Write a single sentence (max 20 words) summarizing the key issue or outcome.
Do not use phrases like "The customer" or "The user". Start with the problem or action.
Example: "Login fails after password reset due to cached session token."`;

export async function summarize(text: string): Promise<string> {
  const openai = getOpenAI();

  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: text.slice(0, 4000) },
    ],
    max_tokens: 80,
    temperature: 0.2,
  });

  return (completion.choices[0]?.message?.content ?? "").trim();
}
