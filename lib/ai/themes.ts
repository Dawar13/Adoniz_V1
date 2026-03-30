import { getOpenAI, CHAT_MODEL } from "./openai";
import { createAdminClient } from "@/lib/supabase/admin";

interface ThemeResult {
  label: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  trend: "rising" | "stable" | "falling";
  example_ids: string[];
  count: number;
}

const SYSTEM_PROMPT = `You are an analyst identifying recurring themes in customer support conversations.
Given a list of conversation summaries, extract up to 8 meaningful themes.
For each theme include:
- label: short title (3-5 words)
- description: one sentence explaining the theme
- severity: "low" | "medium" | "high" | "critical" based on user impact
- trend: "rising" | "stable" | "falling" (use "stable" if unknown)

Respond with JSON only: {"themes": [...]}`;

export async function extractThemes(
  userId: string,
  limit = 200
): Promise<ThemeResult[]> {
  const admin = createAdminClient();

  const { data: conversations } = await admin
    .from("conversations")
    .select("id, summary, category")
    .eq("user_id", userId)
    .not("summary", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!conversations || conversations.length === 0) return [];

  const summaryText = conversations
    .map((c, i) => `${i + 1}. [${c.category ?? "general"}] ${c.summary}`)
    .join("\n");

  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: summaryText.slice(0, 12000) },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1500,
    temperature: 0.3,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as { themes?: Array<Omit<ThemeResult, "example_ids" | "count">> };

  return (parsed.themes ?? []).map((t) => ({
    ...t,
    example_ids: [],
    count: 0,
  }));
}
