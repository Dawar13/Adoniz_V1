"use client";

import type { ChatMessage } from "@/types/chat";
import { SourceCitation } from "./SourceCitation";

interface Props { message: ChatMessage }

export function MessageBubble({ message: msg }: Props) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[85%] rounded-2xl px-4 py-3"
        style={{
          background: isUser ? "var(--adoniz-mist)" : "#fff",
          border: `1px solid ${isUser ? "var(--adoniz-distant-cloud)" : "var(--adoniz-distant-cloud)"}`,
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        }}
      >
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(0,0,0,0.75)", lineHeight: 1.65, margin: 0 }}>
          {msg.content}
        </p>
        {!isUser && msg.sources && msg.sources.length > 0 && (
          <div className="mt-3 flex flex-col gap-1.5">
            {msg.sources.map((s, i) => <SourceCitation key={i} source={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
