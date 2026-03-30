"use client";

import useSWR from "swr";
import type { Batch } from "@/types/conversation";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_COLOR: Record<string, string> = {
  done: "#22C55E",
  processing: "#F59E0B",
  pending: "rgba(0,0,0,0.35)",
  error: "#EF4444",
};

export function BatchHistory() {
  // TODO: Add batches API endpoint
  const { data } = useSWR<{ data: Batch[] }>("/api/ingest/batches", fetcher);
  const batches = data?.data ?? [];

  if (batches.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "15px", color: "var(--adoniz-pine)" }}>
        Past uploads
      </h2>
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--adoniz-distant-cloud)" }}>
        {batches.map((batch, i) => (
          <div key={batch.id} className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: i < batches.length - 1 ? "1px solid var(--adoniz-distant-cloud)" : "none", background: "#fff" }}>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--adoniz-pine)" }}>
                {batch.filename ?? batch.source}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>
                {batch.total_conversations} conversations · {new Date(batch.created_at).toLocaleDateString()}
              </p>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 600, color: STATUS_COLOR[batch.status] ?? "rgba(0,0,0,0.4)" }}>
              {batch.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
