import { StatsRow } from "@/components/dashboard/StatsRow";
import { SentimentDonut } from "@/components/dashboard/SentimentDonut";
import { CategoryBars } from "@/components/dashboard/CategoryBars";
import { VolumeTimeline } from "@/components/dashboard/VolumeTimeline";
import { TrendingThemes } from "@/components/dashboard/TrendingThemes";
import { HighlightCards } from "@/components/dashboard/HighlightCards";

export const metadata = { title: "Dashboard — Adoniz" };

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "22px",
            color: "var(--adoniz-pine)",
            marginBottom: "4px",
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.45)", fontFamily: "var(--font-sans)" }}>
          Voice of customer summary across all ingested conversations
        </p>
      </div>

      <StatsRow />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VolumeTimeline />
        </div>
        <SentimentDonut />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBars />
        <TrendingThemes />
      </div>

      <HighlightCards />
    </div>
  );
}
