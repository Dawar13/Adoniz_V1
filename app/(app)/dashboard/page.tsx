import Link from "next/link";

export const metadata = { title: "Dashboard — ADONIZ" };

export default function DashboardPage() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #E5EAE6",
          borderRadius: "16px",
          padding: "48px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "28px",
            color: "#003D31",
            marginBottom: "12px",
          }}
        >
          Welcome to ADONIZ
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "16px",
            color: "#6B7280",
            lineHeight: 1.6,
            marginBottom: "32px",
          }}
        >
          Upload your first batch of customer conversations to get started.
        </p>
        <Link
          href="/ingest"
          style={{
            display: "inline-block",
            background: "#003D31",
            color: "#fff",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "14px",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Upload Data
        </Link>
      </div>
    </div>
  );
}
