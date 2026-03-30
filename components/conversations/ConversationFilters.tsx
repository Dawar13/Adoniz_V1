"use client";

import { SENTIMENT_LABELS, CATEGORY_LABELS } from "@/lib/product-constants";

export function ConversationFilters() {
  // TODO: wire up URL search params
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        style={{ height: "36px", borderRadius: "8px", padding: "0 12px", border: "1.5px solid var(--adoniz-distant-cloud)", fontFamily: "var(--font-sans)", fontSize: "13px", background: "#fff", outline: "none" }}>
        <option value="">All sentiments</option>
        {Object.entries(SENTIMENT_LABELS).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
      <select
        style={{ height: "36px", borderRadius: "8px", padding: "0 12px", border: "1.5px solid var(--adoniz-distant-cloud)", fontFamily: "var(--font-sans)", fontSize: "13px", background: "#fff", outline: "none" }}>
        <option value="">All categories</option>
        {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
    </div>
  );
}
