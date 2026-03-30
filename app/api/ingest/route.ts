import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseFile } from "@/lib/parsers";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SourceType } from "@/types/database";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const source = (formData.get("source") as SourceType) ?? "csv";
  const tags = JSON.parse((formData.get("tags") as string) ?? "[]");
  const dateFrom = formData.get("date_from") as string | null;
  const dateTo = formData.get("date_to") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const conversations = await parseFile(buffer, file.name, source);

  const admin = createAdminClient();

  // Create batch record
  const { data: batch, error: batchError } = await admin
    .from("batches")
    .insert({
      user_id: user.id,
      source,
      filename: file.name,
      status: "pending",
      tags,
      date_from: dateFrom,
      date_to: dateTo,
    })
    .select()
    .single();

  if (batchError || !batch) {
    return NextResponse.json({ error: "Failed to create batch" }, { status: 500 });
  }

  // Insert raw conversations
  const rows = conversations.map((text) => ({
    user_id: user.id,
    batch_id: batch.id,
    raw_text: text,
    source,
  }));

  const { error: insertError } = await admin.from("conversations").insert(rows);
  if (insertError) {
    return NextResponse.json({ error: "Failed to insert conversations" }, { status: 500 });
  }

  // Update batch totals
  await admin
    .from("batches")
    .update({ total_conversations: rows.length })
    .eq("id", batch.id);

  return NextResponse.json({ batch_id: batch.id, count: rows.length });
}
