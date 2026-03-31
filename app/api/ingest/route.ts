import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { parseFile } from '@/lib/parsers'
import type { Source } from '@/types/conversation'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const text = formData.get('text') as string | null
  const source = (formData.get('source') as Source) ?? 'other'

  try {
    const conversations = await parseFile(file, text)

    const admin = createAdminClient()

    const { data: batch, error: batchError } = await admin
      .from('ingestion_batches')
      .insert({
        user_id: user.id,
        source,
        file_name: file?.name ?? null,
        status: 'parsing',
        total_conversations: conversations.length,
        metadata: {},
      })
      .select()
      .single()

    if (batchError || !batch) {
      return NextResponse.json({ error: 'Failed to create batch' }, { status: 500 })
    }

    const rows = conversations.map(conv => ({
      user_id: user.id,
      batch_id: batch.id,
      source,
      raw_text: conv.raw_text,
      external_id: conv.external_id ?? null,
      conversation_date: conv.conversation_date ?? null,
      participants: conv.participants ?? [],
      pipeline_status: 'raw',
    }))

    const { error: insertError } = await admin.from('conversations').insert(rows)
    if (insertError) {
      return NextResponse.json({ error: 'Failed to insert conversations' }, { status: 500 })
    }

    return NextResponse.json({ batchId: batch.id, conversationCount: conversations.length })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to parse file' },
      { status: 400 }
    )
  }
}
