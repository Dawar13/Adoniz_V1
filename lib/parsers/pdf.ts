import pdfParse from "pdf-parse";

/**
 * Extracts text from a PDF buffer and splits into conversations.
 * Uses blank-line separation after extracting raw text.
 */
export async function parsePDF(buffer: Buffer): Promise<string[]> {
  const data = await pdfParse(buffer);
  const rawText = data.text ?? "";

  // Split on double newlines
  const chunks = rawText
    .split(/\n{2,}/)
    .map((chunk) => chunk.replace(/\s+/g, " ").trim())
    .filter((chunk) => chunk.length > 20); // Filter out short fragments

  return chunks.length > 0 ? chunks : [rawText.trim()];
}
