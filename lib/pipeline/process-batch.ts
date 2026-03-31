import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeText } from '@/lib/ai/sanitizer'
import { analyzeSentiment } from '@/lib/ai/sentiment'
import { categorizeConversation } from '@/lib/ai/categorizer'
import { summarizeConversation } from '@/lib/ai/summarizer'
import { generateEmbeddings } from '@/lib/ai/embeddings'
import { extractThemes } from '@/lib/ai/themes'

const CONCURRENCY = 5

async function processConcurrently<T>(
  items: T[],
  fn: (item: T) => Promise<void>,
  concurrency: number
) {
  const queue = [...items]
  const active: Promise<void>[] = []

  while (queue.length > 0 || active.length > 0) {
    while (active.length < concurrency && queue.length > 0) {
      const item = queue.shift()!
      const promise = fn(item).then(() => {
        active.splice(active.indexOf(promise), 1)
      }).catch(() => {
        active.splice(active.indexOf(promise), 1)
      })
      active.push(promise)
    }
    if (active.length > 0) {
      await Promise.race(active)
    }
  }
}

export async function processBatch(batchId: string, userId: string) {
  const supabase = createAdminClient()

  async function updateBatchStatus(status: string, extra?: Record<string, unknown>) {
    await supabase
      .from('ingestion_batches')
      .update({ status, ...extra })
      .eq('id', batchId)
  }

  try {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('id, raw_text')
      .eq('batch_id', batchId)
      .eq('pipeline_status', 'raw')

    if (error) throw error
    if (!conversations || conversations.length === 0) {
      await updateBatchStatus('completed', { completed_at: new Date().toISOString() })
      return
    }

    // STEP 1: SANITIZE
    await updateBatchStatus('sanitizing')

    await processConcurrently(conversations, async (conv) => {
      try {
        const sanitized = await sanitizeText(conv.raw_text)
        await supabase
          .from('conversations')
          .update({
            sanitized_text: sanitized,
            pipeline_status: 'sanitized',
            word_count: sanitized.split(/\s+/).length,
          })
          .eq('id', conv.id)
      } catch (err) {
        await supabase
          .from('conversations')
          .update({
            pipeline_status: 'failed',
            pipeline_error: `Sanitization failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
          })
          .eq('id', conv.id)
      }
    }, CONCURRENCY)

    // STEP 2: ANALYZE
    await updateBatchStatus('analyzing')

    const { data: sanitized } = await supabase
      .from('conversations')
      .select('id, sanitized_text')
      .eq('batch_id', batchId)
      .eq('pipeline_status', 'sanitized')

    if (!sanitized) throw new Error('No sanitized conversations found')

    let processedCount = 0

    await processConcurrently(sanitized, async (conv) => {
      try {
        const [sentimentResult, categoryResult, summary] = await Promise.all([
          analyzeSentiment(conv.sanitized_text),
          categorizeConversation(conv.sanitized_text),
          summarizeConversation(conv.sanitized_text),
        ])

        await supabase
          .from('conversations')
          .update({
            sentiment: sentimentResult.sentiment,
            sentiment_score: sentimentResult.score,
            category: categoryResult.category,
            category_confidence: categoryResult.confidence,
            summary,
            pipeline_status: 'analyzed',
          })
          .eq('id', conv.id)

        processedCount++
        await supabase
          .from('ingestion_batches')
          .update({ processed_count: processedCount })
          .eq('id', batchId)
      } catch (err) {
        await supabase
          .from('conversations')
          .update({
            pipeline_status: 'failed',
            pipeline_error: `Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
          })
          .eq('id', conv.id)
      }
    }, CONCURRENCY)

    // STEP 3: EMBED
    await updateBatchStatus('embedding')

    const { data: analyzed } = await supabase
      .from('conversations')
      .select('id, sanitized_text')
      .eq('batch_id', batchId)
      .eq('pipeline_status', 'analyzed')

    if (analyzed && analyzed.length > 0) {
      const texts = analyzed.map(c => c.sanitized_text as string)
      const embeddings = await generateEmbeddings(texts)

      for (let i = 0; i < analyzed.length; i++) {
        await supabase
          .from('conversations')
          .update({
            embedding: JSON.stringify(embeddings[i]),
            pipeline_status: 'embedded',
          })
          .eq('id', analyzed[i].id)
      }
    }

    // STEP 4: EXTRACT THEMES
    await updateBatchStatus('extracting_themes')

    const { data: embedded } = await supabase
      .from('conversations')
      .select('id, summary, category, sentiment')
      .eq('batch_id', batchId)
      .eq('pipeline_status', 'embedded')

    if (embedded && embedded.length > 0) {
      const themes = await extractThemes(
        embedded.map(c => ({
          summary: c.summary || '',
          category: c.category || 'general',
          sentiment: c.sentiment || 'neutral',
        }))
      )

      for (const theme of themes) {
        const sampleIds = embedded
          .filter(c => theme.sample_summaries.some(s =>
            c.summary?.toLowerCase().includes(s.toLowerCase().slice(0, 30))
          ))
          .slice(0, 5)
          .map(c => c.id)

        await supabase.from('themes').insert({
          user_id: userId,
          name: theme.name,
          description: theme.description,
          conversation_count: theme.count,
          severity: theme.severity,
          dominant_sentiment: embedded
            .filter(c => sampleIds.includes(c.id))
            .map(c => c.sentiment)[0] || 'neutral',
          sample_conversation_ids: sampleIds,
          sample_summaries: theme.sample_summaries.slice(0, 5),
          first_seen: new Date().toISOString(),
          last_seen: new Date().toISOString(),
        })
      }

      await supabase
        .from('conversations')
        .update({ pipeline_status: 'complete' })
        .eq('batch_id', batchId)
        .eq('pipeline_status', 'embedded')
    }

    // DONE
    await updateBatchStatus('completed', {
      completed_at: new Date().toISOString(),
      processed_count: conversations.length,
    })
  } catch (err) {
    await updateBatchStatus('failed', {
      error_message: err instanceof Error ? err.message : 'Unknown pipeline error',
    })
    throw err
  }
}
