import { getOpenAI, CHAT_MODEL } from "./openai";
import type { CategoryLabel } from "@/types/database";

const CATEGORIES: CategoryLabel[] = [
  "error_bug",
  "feature_request",
  "escalation",
  "billing",
  "onboarding",
  "praise",
  "general",
  "other",
];

const SYSTEM_PROMPT = `You are a customer support conversation classifier.
Classify the conversation into exactly one category from this list:
- error_bug: Technical errors, crashes, bugs, broken features
- feature_request: Requests for new features or improvements
- escalation: Angry customers, threats to cancel, urgent issues requiring manager
- billing: Payment issues, refund requests, subscription questions
- onboarding: Setup help, getting started, initial configuration
- praise: Positive feedback, compliments, thanks
- general: General questions, how-to requests
- other: Doesn't fit any above category

Respond with JSON only: {"category": "<category>"}`;

export async function categorize(text: string): Promise<CategoryLabel> {
  const openai = getOpenAI();

  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: text.slice(0, 4000) },
    ],
    response_format: { type: "json_object" },
    max_tokens: 32,
    temperature: 0,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as { category?: string };
  const cat = parsed.category as CategoryLabel;

  return CATEGORIES.includes(cat) ? cat : "other";
}
