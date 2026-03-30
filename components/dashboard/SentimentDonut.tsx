"use client";

import useSWR from "swr";
import type { SentimentDistribution } from "@/types/analytics";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function SentimentDonut() {
  const { data } = useSWR<SentimentDistribution>("/api/analytics/sentiment", fetcher);

  const total = data?.total ?? 0;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  const r = 40;
  const circ = 2 * Math.PI * r;
  const posAngle = pct(data?.positive ?? 0) / 100 * circ;
  const negAngle = pct(data?.negative ?? 0) / 100 * circ;

  return (
    <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--adoniz-distant-cloud)" }}>
      <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--adoniz-pine)", marginBottom: "16px" }}>
        Sentiment
      </h3>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 100 100" className="w-20 h-20 flex-shrink-0">
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="14" stroke="var(--adoniz-mist)" />
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="14"
            stroke="var(--adoniz-electric-lime)"
            strokeDasharray={`${posAngle} ${circ}`}
            strokeLinecap="round" transform="rotate(-90 50 50)" />
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="14"
            stroke="#EF4444"
            strokeDasharray={`${negAngle} ${circ}`}
            strokeDashoffset={-posAngle}
            strokeLinecap="round" transform="rotate(-90 50 50)" />
          <text x="50" y="54" textAnchor="middle" fontSize="13" fill="var(--adoniz-pine)" fontWeight="700">
            {pct(data?.positive ?? 0)}%
          </text>
        </svg>
        <div className="flex flex-col gap-2">
          {[
            { label: "Positive", value: pct(data?.positive ?? 0), color: "var(--adoniz-electric-lime)" },
            { label: "Neutral",  value: pct(data?.neutral  ?? 0), color: "var(--adoniz-june-ivy)" },
            { label: "Negative", value: pct(data?.negative ?? 0), color: "#EF4444" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(0,0,0,0.6)" }}>
                {s.label} {s.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
