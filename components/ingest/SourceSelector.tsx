"use client";

import type { SourceType } from "@/types/database";
import { SOURCE_LABELS } from "@/lib/product-constants";

interface Props {
  value: SourceType;
  onChange: (v: SourceType) => void;
}

export function SourceSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600, color: "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Source
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SourceType)}
        style={{
          height: "44px", borderRadius: "10px", padding: "0 14px",
          border: "1.5px solid var(--adoniz-distant-cloud)",
          fontFamily: "var(--font-sans)", fontSize: "14px",
          background: "#fff", cursor: "pointer", outline: "none",
        }}
      >
        {Object.entries(SOURCE_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </div>
  );
}
