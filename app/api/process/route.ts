import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processBatch } from "@/lib/pipeline/process-batch";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { batch_id } = await request.json();
  if (!batch_id) {
    return NextResponse.json({ error: "batch_id required" }, { status: 400 });
  }

  // Run async — returns immediately, processing happens in background
  processBatch(batch_id, user.id).catch(console.error);

  return NextResponse.json({ status: "processing", batch_id });
}
