"use client";

import Image from "next/image";

const BORDER = "1px solid rgba(255,255,255,0.08)";

const COL_LINKS: { heading: string; items: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    items: [
      { label: "Dashboard", href: "#" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#" },
      { label: "Docs", href: "#" },
    ],
  },
  {
    heading: "Social",
    items: [
      { label: "Twitter / X", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    heading: "Address",
    items: [
      { label: "San Francisco, CA", href: "#" },
      { label: "United States", href: "#" },
    ],
  },
  {
    heading: "Contact",
    items: [
      { label: "hello@adoniz.io", href: "mailto:hello@adoniz.io" },
      { label: "Support", href: "#" },
    ],
  },
];

function LinkCol({ heading, items }: { heading: string; items: { label: string; href: string }[] }) {
  return (
    <div style={{ padding: "24px 28px" }} className="flex flex-col gap-3">
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase" as const,
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.32)",
        }}
      >
        {heading}
      </span>
      <ul className="flex flex-col gap-2 list-none m-0 p-0">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                transition: "color 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)")}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Geometric decorative mark ─────────────────────────────────────────── */
function DecorativeMark() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className="w-24 h-24"
      style={{ opacity: 0.15 }}
    >
      <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <circle cx="60" cy="60" r="30" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <circle cx="60" cy="60" r="10" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <line x1="10" y1="60" x2="110" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
      <line x1="60" y1="10" x2="60" y2="110" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
      <line x1="24" y1="24" x2="96" y2="96" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
      <line x1="96" y1="24" x2="24" y2="96" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer style={{ background: "var(--adoniz-teal-spill)" }}>
      {/* Top row — 4 equal columns */}
      <div
        className="footer-top-grid grid grid-cols-2 lg:grid-cols-4"
        style={{ borderBottom: BORDER }}
      >
        {COL_LINKS.map((col, i) => (
          <div
            key={col.heading}
            style={{
              borderRight: i < COL_LINKS.length - 1 ? BORDER : "none",
            }}
          >
            <LinkCol heading={col.heading} items={col.items} />
          </div>
        ))}
      </div>

      {/* Bottom row — left ~30% decorative, right ~70% massive wordmark */}
      <div
        className="footer-bottom-grid grid"
        style={{ gridTemplateColumns: "30% 1fr", minHeight: "220px" }}
      >
        {/* Left — logo + copyright + decorative mark */}
        <div
          className="flex flex-col justify-between p-7"
          style={{ borderRight: BORDER }}
        >
          {/* Logo + wordmark */}
          <div className="flex items-center gap-2.5 mb-6">
            <Image
              src="/logos/adoniz-logo.svg"
              alt="Adoniz"
              width={22}
              height={21}
              style={{ filter: "invert(1) brightness(2)", opacity: 0.9 }}
            />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "16px",
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              Adoniz
            </span>
          </div>

          <DecorativeMark />

          {/* Copyright */}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.28)",
              marginTop: "auto",
              paddingTop: "16px",
            }}
          >
            © 2026 Adoniz. All rights reserved.
          </span>
        </div>

        {/* Right — massive wordmark */}
        <div
          className="relative overflow-hidden flex items-end"
          style={{ padding: "24px 32px 0 32px" }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 900,
              fontSize: "clamp(12rem, 22vw, 20rem)",
              lineHeight: 0.85,
              color: "#fff",
              opacity: 0.15,
              letterSpacing: "-0.04em",
              whiteSpace: "nowrap" as const,
              userSelect: "none",
              display: "block",
              // Intentionally clips at bottom/right — creates the Flair-style drama
            }}
          >
            Adoniz
          </span>

          {/* ® in bottom right */}
          <span
            className="absolute bottom-4 right-5"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            ®
          </span>
        </div>
      </div>
    </footer>
  );
}
