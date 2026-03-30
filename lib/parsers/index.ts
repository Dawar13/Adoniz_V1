import type { SourceType } from "@/types/database";
import { parseCSV } from "./csv";
import { parseJSON } from "./json";
import { parseText } from "./text";
import { parsePDF } from "./pdf";

/**
 * Dispatches to the correct parser based on filename extension or declared source type.
 * Returns an array of conversation strings ready for insertion.
 */
export async function parseFile(
  buffer: Buffer,
  filename: string,
  source: SourceType
): Promise<string[]> {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "pdf") return parsePDF(buffer);
  if (ext === "json") return parseJSON(buffer);
  if (ext === "txt" || ext === "text") return parseText(buffer);
  if (ext === "csv") return parseCSV(buffer);

  // Fallback based on declared source type
  switch (source) {
    case "csv":
      return parseCSV(buffer);
    case "json":
      return parseJSON(buffer);
    case "pdf":
      return parsePDF(buffer);
    case "text":
      return parseText(buffer);
    default:
      // For platform exports (intercom, zendesk, etc.), try JSON first then CSV
      try {
        return parseJSON(buffer);
      } catch {
        try {
          return parseCSV(buffer);
        } catch {
          return parseText(buffer);
        }
      }
  }
}
