"use client";

import { useChat } from "@/hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { SuggestedQueries } from "./SuggestedQueries";
import { StreamingIndicator } from "./StreamingIndicator";

export function ChatContainer() {
  const { messages, loading, sendMessage } = useChat();

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-6 py-12">
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "24px", color: "var(--adoniz-pine)", textAlign: "center" }}>
              What do you want to know about your customers?
            </p>
            <SuggestedQueries onSelect={sendMessage} />
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && <StreamingIndicator />}
      </div>
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
