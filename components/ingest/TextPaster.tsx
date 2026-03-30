"use client";

import { useState } from "react";

export function TextPaster() {
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--adoniz-pine)" }}>
        Paste raw text
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste conversation transcripts here, one per line or separated by '---'"
        rows={8}
        style={{
          borderRadius: "12px",
          border: "1.5px solid var(--adoniz-distant-cloud)",
          padding: "14px 16px",
          fontSize: "13px",
          fontFamily: "var(--font-sans)",
          resize: "vertical",
          outline: "none",
          lineHeight: 1.6,
        }}
      />
      <button
        disabled={!text.trim()}
        style={{
          height: "44px", borderRadius: "10px",
          background: text.trim() ? "var(--adoniz-pine)" : "var(--adoniz-mist)",
          color: text.trim() ? "#fff" : "rgba(0,0,0,0.35)",
          fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px",
          border: "none", cursor: text.trim() ? "pointer" : "default",
        }}
      >
        Upload Text
      </button>
    </div>
  );
}
