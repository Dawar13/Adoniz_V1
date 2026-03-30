import { getOpenAI, CHAT_MODEL } from "./openai";
import type { SentimentLabel } from "@/types/database";

interface SentimentResult {
  label: SentimentLabel;
  score: number; // 0-1 confidence
}

const SYSTEM_PROMPT = `You are a sentiment classifier for customer support conversations.
Classify the conversation as exactly one of: positive, negative, neutral.
Respond with JSON only: {"label": "positive"|"negative"|"neutral", "score": 0.0-1.0}
The score is your confidence in the label.`;

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const openai = getOpenAI();

  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: text.slice(0, 4000) },
    ],
    response_format: { type: "json_object" },
    max_tokens: 64,
    temperature: 0,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as Partial<SentimentResult>;

  const label = (["positive", "negative", "neutral"] as SentimentLabel[]).includes(
    parsed.label as SentimentLabel
  )
    ? (parsed.label as SentimentLabel)
    : "neutral";

  return { label, score: Math.min(1, Math.max(0, parsed.score ?? 0.5)) };
}
