import { ConversationList } from "@/components/conversations/ConversationList";
import { ConversationFilters } from "@/components/conversations/ConversationFilters";

export const metadata = { title: "Conversations — Adoniz" };

export default function ConversationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "22px",
            color: "var(--adoniz-pine)",
            marginBottom: "4px",
          }}
        >
          Conversations
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.45)", fontFamily: "var(--font-sans)" }}>
          Browse, search, and filter all ingested conversations
        </p>
      </div>
      <ConversationFilters />
      <ConversationList />
    </div>
  );
}
