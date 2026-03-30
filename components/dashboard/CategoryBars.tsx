"use client";

import useSWR from "swr";
import type { CategoryBreakdown } from "@/types/analytics";
import { CATEGORY_LABELS } from "@/lib/product-constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function CategoryBars() {
  const { data } = useSWR<CategoryBreakdown[]>("/api/analytics/categories", fetcher);
  const top = (data ?? []).slice(0, 6);

  return (
    <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--adoniz-distant-cloud)" }}>
      <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--adoniz-pine)", marginBottom: "16px" }}>
        Top Categories
      </h3>
      <div className="flex flex-col gap-3">
        {top.map((item) => (
          <div key={item.category}>
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(0,0,0,0.65)" }}>
                {CATEGORY_LABELS[item.category] ?? item.category}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>
                {item.count}
              </span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: "5px", background: "var(--adoniz-mist)" }}>
              <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, background: "var(--adoniz-electric-lime)", transition: "width 0.6s ease" }} />
            </div>
          </div>
        ))}
        {top.length === 0 && (
          <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.35)", fontFamily: "var(--font-sans)" }}>No data yet</p>
        )}
      </div>
    </div>
  );
}
