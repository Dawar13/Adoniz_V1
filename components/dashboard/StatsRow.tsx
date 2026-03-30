"use client";

import useSWR from "swr";
import type { DashboardStats } from "@/types/analytics";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function StatsRow() {
  const { data } = useSWR<DashboardStats>("/api/analytics/summary", fetcher);

  const stats = [
    { label: "Conversations",  value: data?.total_conversations?.toLocaleString() ?? "—",  delta: data?.conversations_delta },
    { label: "Positive",       value: data?.positive_percentage ? `${data.positive_percentage}%` : "—", delta: data?.positive_delta },
    { label: "Themes Found",   value: data?.themes_found?.toString() ?? "—",               delta: data?.themes_delta },
    { label: "Action Items",   value: data?.action_items?.toString() ?? "—",               delta: data?.action_items_delta },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl p-5"
          style={{ background: "#fff", border: "1px solid var(--adoniz-distant-cloud)" }}>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "26px", color: "var(--adoniz-pine)" }}>
              {stat.value}
            </span>
            {stat.delta !== undefined && (
              <span style={{ fontSize: "11px", fontWeight: 600, color: (stat.delta ?? 0) >= 0 ? "#22C55E" : "#EF4444", fontFamily: "var(--font-sans)" }}>
                {(stat.delta ?? 0) >= 0 ? "↑" : "↓"}{Math.abs(stat.delta ?? 0)}
              </span>
            )}
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(0,0,0,0.45)" }}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
