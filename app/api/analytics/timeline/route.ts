import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") ?? "30");
  const since = new Date(Date.now() - days * 86400000).toISOString();

  const { data, error } = await supabase
    .from("conversations")
    .select("conversation_date, sentiment")
    .eq("user_id", user.id)
    .gte("conversation_date", since)
    .order("conversation_date");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Bucket by day
  const dayMap = new Map<string, { total: number; positive: number; negative: number; neutral: number }>();
  for (const row of data) {
    const day = (row.conversation_date ?? "").slice(0, 10);
    if (!day) continue;
    const entry = dayMap.get(day) ?? { total: 0, positive: 0, negative: 0, neutral: 0 };
    entry.total++;
    if (row.sentiment) entry[row.sentiment as keyof typeof entry]++;
    dayMap.set(day, entry);
  }

  const timeline = Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, stats]) => ({ date, ...stats }));

  return NextResponse.json(timeline);
}
