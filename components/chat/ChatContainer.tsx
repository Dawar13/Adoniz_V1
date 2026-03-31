"use client";

import { useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { SuggestedQueries } from "./SuggestedQueries";
import { StreamingIndicator } from "./StreamingIndicator";

const SESSION_ID = crypto.randomUUID();

export function ChatContainer() {
  const { messages, isLoading, sendMessage } = useChat();
  const sessionRef = useRef(SESSION_ID);

  const handleSend = (message: string) => {
    sendMessage(message, sessionRef.current);
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-6 py-12">
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "24px", color: "var(--adoniz-pine)", textAlign: "center" }}>
              What do you want to know about your customers?
            </p>
            <SuggestedQueries onSelect={handleSend} />
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <StreamingIndicator />}
      </div>
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
