import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // TODO: Use AI to generate a real-time summary
  // For now returns structured data from DB
  const { data, error } = await supabase
    .from("conversations")
    .select("summary, sentiment, category")
    .eq("user_id", user.id)
    .not("summary", "is", null)
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ conversations: data });
}
