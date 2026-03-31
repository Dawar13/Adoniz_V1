import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { processBatch } from '@/lib/pipeline/process-batch'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { batchId } = await request.json()
  if (!batchId) return NextResponse.json({ error: 'batchId required' }, { status: 400 })

  const admin = createAdminClient()

  // Verify batch belongs to user
  const { data: batch } = await admin
    .from('ingestion_batches')
    .select('id, user_id')
    .eq('id', batchId)
    .eq('user_id', user.id)
    .single()

  if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 })

  try {
    await processBatch(batchId, user.id)

    const { data: result } = await admin
      .from('ingestion_batches')
      .select('processed_count')
      .eq('id', batchId)
      .single()

    return NextResponse.json({ status: 'completed', processed: result?.processed_count ?? 0 })
  } catch (err) {
    return NextResponse.json(
      { status: 'failed', error: err instanceof Error ? err.message : 'Pipeline error' },
      { status: 500 }
    )
  }
}
