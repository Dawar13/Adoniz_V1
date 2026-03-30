import Papa from "papaparse";

/**
 * Parses a CSV buffer into an array of conversation strings.
 * Expects either:
 * - A single column with the full conversation text, OR
 * - Multiple columns where we concatenate role + content pairs
 */
export function parseCSV(buffer: Buffer): string[] {
  const text = buffer.toString("utf-8");

  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    trimHeaders: true,
  });

  if (result.errors.length > 0) {
    const fatal = result.errors.filter((e) => e.type === "Delimiter");
    if (fatal.length > 0) throw new Error("Invalid CSV format");
  }

  const rows = result.data;
  if (rows.length === 0) return [];

  const columns = Object.keys(rows[0]);

  // Try to find a primary text column
  const textColumn = columns.find((c) =>
    ["conversation", "text", "content", "message", "transcript", "body"].includes(c.toLowerCase())
  );

  if (textColumn) {
    return rows
      .map((r) => r[textColumn])
      .filter((t): t is string => typeof t === "string" && t.trim().length > 0);
  }

  // Fallback: concatenate all column values into one string per row
  return rows
    .map((r) => {
      return columns
        .map((col) => {
          const val = r[col];
          return val ? `${col}: ${val}` : null;
        })
        .filter(Boolean)
        .join("\n");
    })
    .filter((t) => t.trim().length > 0);
}
