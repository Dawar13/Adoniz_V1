import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routeQuery } from "@/lib/ai/chat-router";
import { answerWithRAG } from "@/lib/ai/rag";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { session_id, message } = await request.json();
  if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

  const queryType = await routeQuery(message);
  const { answer, sources } = await answerWithRAG(message, user.id, queryType);

  const sessionId = session_id ?? crypto.randomUUID();

  // Persist messages
  await supabase.from("chat_messages").insert([
    { user_id: user.id, session_id: sessionId, role: "user", content: message },
    { user_id: user.id, session_id: sessionId, role: "assistant", content: answer, query_type: queryType as "aggregate" | "search" | "hybrid" },
  ]);

  return NextResponse.json({ message: answer, sources, query_type: queryType });
}
