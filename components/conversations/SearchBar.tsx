"use client";

import { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search conversations…" }: Props) {
  const [value, setValue] = useState("");

  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => { setValue(e.target.value); onSearch(e.target.value); }}
        placeholder={placeholder}
        style={{
          height: "40px", width: "100%", borderRadius: "10px",
          padding: "0 16px 0 38px",
          border: "1.5px solid var(--adoniz-distant-cloud)",
          fontFamily: "var(--font-sans)", fontSize: "13px",
          background: "#fff", outline: "none",
        }}
      />
      <span className="absolute" style={{ left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "rgba(0,0,0,0.35)" }}>
        ⌕
      </span>
    </div>
  );
}
