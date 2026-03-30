"use client";

import { SUGGESTED_QUERIES } from "@/lib/product-constants";

interface Props { onSelect: (q: string) => void }

export function SuggestedQueries({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-lg">
      {SUGGESTED_QUERIES.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="rounded-full px-4 py-2"
          style={{
            background: "var(--adoniz-mist)", border: "1px solid var(--adoniz-distant-cloud)",
            fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--adoniz-forest)",
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
