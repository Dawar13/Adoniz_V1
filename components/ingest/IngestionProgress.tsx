"use client";

interface Props {
  total: number;
  processed: number;
  status: "pending" | "processing" | "done" | "error";
  errorMessage?: string | null;
}

export function IngestionProgress({ total, processed, status, errorMessage }: Props) {
  const pct = total > 0 ? Math.round((processed / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 rounded-xl p-5"
      style={{ background: "#fff", border: "1px solid var(--adoniz-distant-cloud)" }}>
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--adoniz-pine)" }}>
          Processing
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "rgba(0,0,0,0.5)" }}>
          {processed}/{total}
        </span>
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: "6px", background: "var(--adoniz-mist)" }}>
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: status === "error" ? "#EF4444" : "var(--adoniz-electric-lime)" }} />
      </div>
      {status === "done" && (
        <p style={{ fontSize: "13px", color: "#22C55E", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
          ✓ Complete — {total} conversations processed
        </p>
      )}
      {status === "error" && errorMessage && (
        <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "var(--font-sans)" }}>{errorMessage}</p>
      )}
    </div>
  );
}
