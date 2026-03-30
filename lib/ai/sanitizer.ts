/**
 * Strips obvious PII patterns from conversation text before storage and analysis.
 * This is a best-effort regex pass; for production, complement with an NLP model.
 */

const PII_PATTERNS: Array<[RegExp, string]> = [
  // Email addresses
  [/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, "[EMAIL]"],
  // Phone numbers (various formats)
  [/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, "[PHONE]"],
  // Credit card numbers (basic 16-digit)
  [/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, "[CARD]"],
  // SSN
  [/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN]"],
  // IP addresses
  [/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "[IP]"],
  // URLs with usernames/passwords
  [/https?:\/\/[^:]+:[^@]+@/g, "[CREDENTIALS]@"],
  // Specific numeric IDs that look like account numbers (7+ digits)
  [/\baccount[:\s#]*\d{6,}\b/gi, "[ACCOUNT]"],
];

export function sanitize(text: string): string {
  let result = text;
  for (const [pattern, replacement] of PII_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result.trim();
}
