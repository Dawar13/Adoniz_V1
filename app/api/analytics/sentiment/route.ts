import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("conversations")
    .select("sentiment")
    .eq("user_id", user.id)
    .not("sentiment", "is", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const counts = { positive: 0, negative: 0, neutral: 0, total: data.length };
  for (const row of data) {
    if (row.sentiment) counts[row.sentiment]++;
  }

  return NextResponse.json(counts);
}
