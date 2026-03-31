"use client";

import type { ConversationRow } from "@/types/conversation";
import { CATEGORY_LABELS, SENTIMENT_COLORS } from "@/lib/product-constants";
import Link from "next/link";

interface Props { conversation: ConversationRow }

export function ConversationCard({ conversation: c }: Props) {
  const sentimentColor = c.sentiment ? (SENTIMENT_COLORS as Record<string, { dot: string; bg: string; text: string }>)[c.sentiment] : null;

  return (
    <Link href={`/conversations/${c.id}`} style={{ textDecoration: "none" }}>
      <div className="rounded-2xl p-4 cursor-pointer"
        style={{ background: "#fff", border: "1px solid var(--adoniz-distant-cloud)", transition: "box-shadow 0.15s" }}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {sentimentColor && (
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: sentimentColor.dot }} />
          )}
          {sentimentColor && c.sentiment && (
            <span className="rounded-full px-2 py-0.5"
              style={{ fontSize: "10px", fontWeight: 600, fontFamily: "var(--font-sans)", background: sentimentColor.bg, color: sentimentColor.text }}>
              {c.sentiment}
            </span>
          )}
          {c.category && (
            <span className="rounded-full px-2 py-0.5"
              style={{ fontSize: "10px", fontWeight: 500, fontFamily: "var(--font-sans)", background: "rgba(0,61,49,0.07)", color: "var(--adoniz-forest)" }}>
              {CATEGORY_LABELS[c.category] ?? c.category}
            </span>
          )}
          <span style={{ marginLeft: "auto", fontSize: "10px", color: "rgba(0,0,0,0.35)", fontFamily: "var(--font-sans)" }}>
            {c.conversation_date ? new Date(c.conversation_date).toLocaleDateString() : ""}
          </span>
        </div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(0,0,0,0.65)", lineHeight: 1.5 }}>
          {c.summary ?? c.sanitized_text?.slice(0, 120) ?? c.raw_text.slice(0, 120)}…
        </p>
      </div>
    </Link>
  );
}
