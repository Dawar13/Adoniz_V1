/**
 * Parses a JSON buffer into conversation strings.
 * Supports common export shapes:
 * - Array of strings
 * - Array of objects with a text/content/message field
 * - Array of conversation objects with messages array (Intercom/Zendesk style)
 */
export function parseJSON(buffer: Buffer): string[] {
  const text = buffer.toString("utf-8");
  const data = JSON.parse(text) as unknown;

  if (!Array.isArray(data)) {
    throw new Error("JSON must be an array of conversations");
  }

  return data
    .map((item): string | null => {
      if (typeof item === "string") return item;

      if (typeof item !== "object" || item === null) return null;
      const obj = item as Record<string, unknown>;

      // Check for a direct text field
      for (const key of ["conversation", "transcript", "text", "content", "body", "message"]) {
        if (typeof obj[key] === "string") return obj[key] as string;
      }

      // Check for messages array (chat export format)
      if (Array.isArray(obj.messages)) {
        const messages = obj.messages as Array<Record<string, unknown>>;
        return messages
          .map((m) => {
            const role = (m.role ?? m.author ?? m.from ?? "").toString();
            const content = (m.content ?? m.text ?? m.body ?? m.message ?? "").toString();
            return role ? `${role}: ${content}` : content;
          })
          .filter(Boolean)
          .join("\n");
      }

      // Last resort: stringify the object
      return JSON.stringify(obj);
    })
    .filter((t): t is string => t !== null && t.trim().length > 0);
}
