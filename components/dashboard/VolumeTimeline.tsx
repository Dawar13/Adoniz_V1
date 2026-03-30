"use client";

import useSWR from "swr";
import type { TimelinePoint } from "@/types/analytics";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function VolumeTimeline() {
  const { data } = useSWR<TimelinePoint[]>("/api/analytics/timeline?days=30", fetcher);
  const points = data ?? [];

  const max = Math.max(...points.map((p) => p.total), 1);
  const W = 600, H = 120;
  const pad = { l: 0, r: 0, t: 8, b: 0 };
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;

  const xOf = (i: number) => pad.l + (i / Math.max(points.length - 1, 1)) * chartW;
  const yOf = (v: number) => pad.t + chartH - (v / max) * chartH;

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${xOf(i)},${yOf(p.total)}`).join(" ");
  const area = points.length
    ? `${line} L${xOf(points.length - 1)},${H} L${xOf(0)},${H} Z`
    : "";

  return (
    <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--adoniz-distant-cloud)" }}>
      <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--adoniz-pine)", marginBottom: "16px" }}>
        Volume · Last 30 days
      </h3>
      {points.length > 0 ? (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100px" }}>
          <defs>
            <linearGradient id="vol-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--adoniz-electric-lime)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--adoniz-electric-lime)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#vol-fill)" />
          <path d={line} fill="none" stroke="var(--adoniz-electric-lime)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.35)", fontFamily: "var(--font-sans)" }}>No data yet</p>
        </div>
      )}
    </div>
  );
}
