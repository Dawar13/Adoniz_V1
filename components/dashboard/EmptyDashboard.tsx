import Link from "next/link";

export function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "22px", color: "var(--adoniz-pine)" }}>
        No conversations yet
      </p>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(0,0,0,0.45)", maxWidth: "320px" }}>
        Upload your first batch of customer conversations to start seeing insights
      </p>
      <Link href="/ingest"
        style={{
          display: "inline-flex", alignItems: "center",
          height: "44px", padding: "0 24px", borderRadius: "10px",
          background: "var(--adoniz-pine)", color: "#fff",
          fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "14px",
          textDecoration: "none",
        }}>
        Ingest Data →
      </Link>
    </div>
  );
}
