import { ConversationDetail } from "@/components/conversations/ConversationDetail";

export const metadata = { title: "Conversation — Adoniz" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConversationDetailPage({ params }: Props) {
  const { id } = await params;
  return <ConversationDetail id={id} />;
}
