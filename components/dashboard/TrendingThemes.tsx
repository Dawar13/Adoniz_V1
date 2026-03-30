"use client";

import useSWR from "swr";
import type { Theme } from "@/types/analytics";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#EF4444",
  high: "#F59E0B",
  medium: "var(--adoniz-forest)",
  low: "rgba(0,0,0,0.35)",
};

export function TrendingThemes() {
  const { data } = useSWR<Theme[]>("/api/analytics/themes", fetcher);
  const themes = (data ?? []).slice(0, 6);

  return (
    <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--adoniz-distant-cloud)" }}>
      <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--adoniz-pine)", marginBottom: "16px" }}>
        Trending Themes
      </h3>
      <div className="flex flex-col gap-2">
        {themes.map((theme) => (
          <div key={theme.id} className="flex items-center justify-between rounded-xl px-3 py-2.5"
            style={{ background: "var(--adoniz-lighthouse)", border: "1px solid var(--adoniz-distant-cloud)" }}>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--adoniz-pine)" }}>{theme.label}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>{theme.conversation_count} conversations</p>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "11px", fontWeight: 600, color: SEVERITY_COLORS[theme.severity] ?? "rgba(0,0,0,0.4)", fontFamily: "var(--font-sans)" }}>
                {theme.severity}
              </span>
              <span style={{ fontSize: "12px" }}>{theme.trend === "rising" ? "↑" : theme.trend === "falling" ? "↓" : "→"}</span>
            </div>
          </div>
        ))}
        {themes.length === 0 && (
          <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.35)", fontFamily: "var(--font-sans)" }}>
            Themes will appear after processing conversations
          </p>
        )}
      </div>
    </div>
  );
}
