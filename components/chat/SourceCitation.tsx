"use client";

import { useState } from "react";
import type { ConversationSource } from "@/types/chat";
import { SENTIMENT_COLORS, CATEGORY_LABELS } from "@/lib/product-constants";

interface Props { source: ConversationSource }

export function SourceCitation({ source: s }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button onClick={() => setExpanded(!expanded)}
      className="w-full text-left rounded-lg px-3 py-2"
      style={{ background: "var(--adoniz-lighthouse)", border: "1px solid var(--adoniz-distant-cloud)", cursor: "pointer" }}>
      <div className="flex items-center gap-2">
        {s.sentiment && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: SENTIMENT_COLORS[s.sentiment] ?? "rgba(0,0,0,0.3)" }} />}
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(0,0,0,0.5)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {s.summary ?? "Source conversation"}
        </span>
        <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.3)" }}>{expanded ? "▴" : "▾"}</span>
      </div>
      {expanded && s.summary && (
        <p style={{ marginTop: "6px", fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(0,0,0,0.6)", lineHeight: 1.5 }}>
          {s.summary}
        </p>
      )}
    </button>
  );
}
