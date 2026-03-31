"use client";

import useSWR from "swr";
import type { ConversationRow } from "@/types/conversation";
import { CATEGORY_LABELS, SENTIMENT_COLORS } from "@/lib/product-constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Props { id: string }

export function ConversationDetail({ id }: Props) {
  const { data: c, isLoading } = useSWR<ConversationRow>(`/api/conversations/${id}`, fetcher);

  if (isLoading) return <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px" }}>Loading…</p>;
  if (!c) return <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px" }}>Not found</p>;

  const sentimentColor = c.sentiment
    ? (SENTIMENT_COLORS as Record<string, { dot: string; bg: string; text: string }>)[c.sentiment]
    : null;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        {sentimentColor && c.sentiment && (
          <span className="rounded-full px-3 py-1"
            style={{ fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-sans)", background: sentimentColor.bg, color: sentimentColor.text }}>
            {c.sentiment}
          </span>
        )}
        {c.category && (
          <span className="rounded-full px-3 py-1"
            style={{ fontSize: "12px", fontWeight: 500, fontFamily: "var(--font-sans)", background: "rgba(0,61,49,0.07)", color: "var(--adoniz-forest)" }}>
            {CATEGORY_LABELS[c.category] ?? c.category}
          </span>
        )}
      </div>

      {/* Summary */}
      {c.summary && (
        <div className="rounded-2xl p-5" style={{ background: "var(--adoniz-mist)", border: "1px solid var(--adoniz-distant-cloud)" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Summary</p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--adoniz-pine)", lineHeight: 1.6 }}>{c.summary}</p>
        </div>
      )}

      {/* Full text */}
      <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--adoniz-distant-cloud)" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
          {c.sanitized_text ? "Sanitized Text" : "Raw Text"}
        </p>
        <pre style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(0,0,0,0.7)", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
          {c.sanitized_text ?? c.raw_text}
        </pre>
      </div>
    </div>
  );
}
