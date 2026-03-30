"use client";

import { useState, useRef } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-3 rounded-2xl p-3"
      style={{ background: "#fff", border: "1.5px solid var(--adoniz-distant-cloud)" }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about your customers…"
        rows={1}
        style={{
          flex: 1, resize: "none", border: "none", outline: "none",
          fontFamily: "var(--font-sans)", fontSize: "14px",
          color: "rgba(0,0,0,0.75)", lineHeight: 1.6, background: "transparent",
        }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="flex-shrink-0 rounded-xl flex items-center justify-center"
        style={{
          width: "36px", height: "36px",
          background: value.trim() && !disabled ? "var(--adoniz-pine)" : "var(--adoniz-mist)",
          border: "none", cursor: value.trim() && !disabled ? "pointer" : "default",
          fontSize: "16px", color: value.trim() && !disabled ? "#fff" : "rgba(0,0,0,0.3)",
          transition: "all 0.15s",
        }}
      >
        ↑
      </button>
    </div>
  );
}
