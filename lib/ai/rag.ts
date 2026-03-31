import { openai, CHAT_MODEL } from "./openai";
import { generateEmbedding } from "./embeddings";
import { createAdminClient } from "@/lib/supabase/admin";
import type { QueryType } from "./chat-router";

interface RAGSource {
  id: string;
  summary: string | null;
  sanitized_text: string | null;
  sentiment: string | null;
  category: string | null;
  occurred_at: string | null;
  similarity: number;
}

interface RAGResult {
  answer: string;
  sources: RAGSource[];
}

const ANSWER_SYSTEM_PROMPT = `You are an AI analyst for a customer support insights tool.
Answer the user's question based on the conversation excerpts provided.
Be concise, specific, and cite patterns across multiple conversations when relevant.
If the context doesn't have enough information, say so honestly.`;

export async function answerWithRAG(
  query: string,
  userId: string,
  queryType: QueryType
): Promise<RAGResult> {
  const admin = createAdminClient();

  let sources: RAGSource[] = [];
  let contextText = "";

  if (queryType === "rag") {
    // Semantic search using embeddings
    const queryEmbedding = await generateEmbedding(query);

    const { data: matches } = await admin.rpc("match_conversations", {
      p_user_id: userId,
      query_embedding: queryEmbedding,
      match_threshold: 0.6,
      match_count: 8,
    });

    sources = (matches ?? []) as RAGSource[];
    contextText = sources
      .map(
        (s, i) =>
          `[${i + 1}] ${s.summary ?? s.sanitized_text?.slice(0, 200) ?? ""} (sentiment: ${s.sentiment ?? "unknown"}, category: ${s.category ?? "unknown"})`
      )
      .join("\n\n");
  } else {
    // For analytics/summary queries, pull recent conversations
    const { data: recent } = await admin
      .from("conversations")
      .select("id, summary, sanitized_text, sentiment, category, conversation_date")
      .eq("user_id", userId)
      .not("summary", "is", null)
      .order("created_at", { ascending: false })
      .limit(30);

    sources = (recent ?? []).map((r) => ({
      id: r.id,
      summary: r.summary,
      sanitized_text: r.sanitized_text,
      sentiment: r.sentiment,
      category: r.category,
      occurred_at: r.conversation_date,
      similarity: 1,
    }));
    contextText = sources
      .map(
        (s, i) =>
          `[${i + 1}] ${s.summary ?? ""} (sentiment: ${s.sentiment ?? "unknown"}, category: ${s.category ?? "unknown"})`
      )
      .join("\n\n");
  }

  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: ANSWER_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Context:\n${contextText}\n\nQuestion: ${query}`,
      },
    ],
    max_tokens: 600,
    temperature: 0.4,
  });

  const answer = completion.choices[0]?.message?.content ?? "I couldn't find relevant information.";

  return { answer, sources };
}
