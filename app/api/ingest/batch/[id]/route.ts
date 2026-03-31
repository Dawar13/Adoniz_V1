import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const admin = createAdminClient()

  const { data: batch, error } = await admin
    .from('ingestion_batches')
    .select('id, status, total_conversations, processed_count, error_message, created_at, completed_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 })

  return NextResponse.json(batch)
}
