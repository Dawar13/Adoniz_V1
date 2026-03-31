"use client";

import useSWR from "swr";
import type { ConversationRow } from "@/types/conversation";
import { ConversationCard } from "./ConversationCard";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ConversationList() {
  const { data, isLoading } = useSWR<{ data: ConversationRow[] }>("/api/conversations?page_size=20", fetcher);

  if (isLoading) {
    return <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(0,0,0,0.4)" }}>Loading…</p>;
  }

  const conversations = data?.data ?? [];

  if (conversations.length === 0) {
    return (
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(0,0,0,0.4)" }}>
        No conversations found
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {conversations.map((c: ConversationRow) => (
        <ConversationCard key={c.id} conversation={c} />
      ))}
    </div>
  );
}
