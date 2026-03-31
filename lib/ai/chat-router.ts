import { openai, CHAT_MODEL } from "./openai";

export type QueryType = "rag" | "analytics" | "summary";

const SYSTEM_PROMPT = `You are a query router for a customer support analytics tool.
Classify the user's question into one of:
- rag: Searching for specific conversations, examples, or details ("show me", "find", "what did customers say about")
- analytics: Requesting counts, trends, distributions, or aggregates ("how many", "most common", "percentage", "trend")
- summary: Asking for an overview or general summary ("summarize", "overview", "what's going on with")

Respond with JSON only: {"type": "rag"|"analytics"|"summary"}`;

export async function routeQuery(query: string): Promise<QueryType> {

  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query },
    ],
    response_format: { type: "json_object" },
    max_tokens: 32,
    temperature: 0,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as { type?: string };

  const valid: QueryType[] = ["rag", "analytics", "summary"];
  return valid.includes(parsed.type as QueryType) ? (parsed.type as QueryType) : "rag";
}
