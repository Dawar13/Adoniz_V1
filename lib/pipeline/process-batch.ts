import { createAdminClient } from "@/lib/supabase/admin";
import { sanitize } from "@/lib/ai/sanitizer";
import { analyzeSentiment } from "@/lib/ai/sentiment";
import { categorize } from "@/lib/ai/categorizer";
import { summarize } from "@/lib/ai/summarizer";
import { embed } from "@/lib/ai/embeddings";

const BATCH_SIZE = 10; // Conversations processed concurrently

/**
 * Processes all unprocessed conversations in a batch:
 * sanitize → summarize → sentiment → categorize → embed
 * Updates batch status throughout.
 */
export async function processBatch(batchId: string, userId: string): Promise<void> {
  const admin = createAdminClient();

  // Mark batch as processing
  await admin
    .from("batches")
    .update({ status: "processing" })
    .eq("id", batchId)
    .eq("user_id", userId);

  const { data: conversations, error } = await admin
    .from("conversations")
    .select("id, raw_text")
    .eq("batch_id", batchId)
    .eq("user_id", userId)
    .is("sanitized_text", null);

  if (error || !conversations || conversations.length === 0) {
    await admin
      .from("batches")
      .update({ status: error ? "error" : "done", error_message: error?.message ?? null })
      .eq("id", batchId);
    return;
  }

  let processed = 0;

  // Process in chunks to limit concurrent OpenAI calls
  for (let i = 0; i < conversations.length; i += BATCH_SIZE) {
    const chunk = conversations.slice(i, i + BATCH_SIZE);

    await Promise.all(
      chunk.map(async (conv) => {
        try {
          const sanitized = sanitize(conv.raw_text);
          const [summary, sentimentResult, category, embedding] = await Promise.all([
            summarize(sanitized),
            analyzeSentiment(sanitized),
            categorize(sanitized),
            embed(sanitized),
          ]);

          await admin
            .from("conversations")
            .update({
              sanitized_text: sanitized,
              summary,
              sentiment: sentimentResult.label,
              sentiment_score: sentimentResult.score,
              category,
              embedding,
            })
            .eq("id", conv.id);

          processed++;
        } catch (err) {
          console.error(`Failed to process conversation ${conv.id}:`, err);
        }
      })
    );

    // Update progress after each chunk
    await admin
      .from("batches")
      .update({ processed_conversations: processed })
      .eq("id", batchId);
  }

  // Mark batch complete
  await admin
    .from("batches")
    .update({ status: "done", processed_conversations: processed })
    .eq("id", batchId);
}
