import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("conversations")
    .select("category, sentiment")
    .eq("user_id", user.id)
    .not("category", "is", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Aggregate by category
  const map = new Map<string, { count: number; positive: number; negative: number; neutral: number }>();
  for (const row of data) {
    if (!row.category) continue;
    const entry = map.get(row.category) ?? { count: 0, positive: 0, negative: 0, neutral: 0 };
    entry.count++;
    if (row.sentiment) (entry as Record<string, number>)[row.sentiment as string]++;
    map.set(row.category, entry);
  }

  const result = Array.from(map.entries())
    .map(([category, stats]) => ({
      category,
      count: stats.count,
      percentage: data.length > 0 ? (stats.count / data.length) * 100 : 0,
      sentiment_breakdown: { positive: stats.positive, negative: stats.negative, neutral: stats.neutral },
    }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json(result);
}
