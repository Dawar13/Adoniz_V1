"use client";

import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export function useSentiment() {
  return useSWR("/api/analytics/sentiment", fetcher, { revalidateOnFocus: false });
}

export function useCategories() {
  return useSWR("/api/analytics/categories", fetcher, { revalidateOnFocus: false });
}

export function useTimeline(range: "7d" | "30d" | "90d" = "30d") {
  return useSWR(`/api/analytics/timeline?range=${range}`, fetcher, { revalidateOnFocus: false });
}

export function useThemes() {
  return useSWR("/api/analytics/themes", fetcher, { revalidateOnFocus: false });
}

export function useAnalyticsSummary() {
  return useSWR("/api/analytics/summary", fetcher, { revalidateOnFocus: false });
}
