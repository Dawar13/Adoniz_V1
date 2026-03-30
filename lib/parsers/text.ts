/**
 * Parses a plain text buffer into conversation strings.
 * Conversations are separated by blank lines (one or more).
 * If the file looks like one big conversation (no blank lines), returns it as a single entry.
 */
export function parseText(buffer: Buffer): string[] {
  const text = buffer.toString("utf-8");

  // Split on double newlines (blank line separator)
  const chunks = text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);

  if (chunks.length === 0) return [];

  // If only one chunk but very long, try splitting on dashes/equals separators
  if (chunks.length === 1 && chunks[0].length > 2000) {
    const separated = chunks[0]
      .split(/\n[-=]{3,}\n/)
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    if (separated.length > 1) return separated;
  }

  return chunks;
}
