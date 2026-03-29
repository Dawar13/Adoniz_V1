"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FEATURES } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Sentiment smooth area chart ────────────────────────────────────────── */
function SentimentChart() {
  // Normalised y values (0=bottom, 1=top) — a smooth upward-trending wave
  const pts = [0.38, 0.52, 0.44, 0.61, 0.55, 0.72, 0.65, 0.80, 0.74, 0.88];
  const W = 260;
  const H = 72;
  const pad = 6;
  const innerW = W - pad * 2;
  const innerH = H - pad * 2;

  // Build SVG smooth cubic bezier path from points
  const coords = pts.map((v, i) => ({
    x: pad + (i / (pts.length - 1)) * innerW,
    y: pad + (1 - v) * innerH,
  }));

  // Catmull-Rom → cubic bezier conversion for smooth curves
  function pathD(points: { x: number; y: number }[]) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  const linePath = pathD(coords);
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${H} L ${coords[0].x} ${H} Z`;

  return (
    <div className="mt-4" style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "72px", overflow: "visible" }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="sentiment-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D1F843" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#D1F843" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#sentiment-fill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        />
        {/* Line stroke — animated draw */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="var(--adoniz-electric-lime)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
        />
        {/* Last point dot */}
        <motion.circle
          cx={coords[coords.length - 1].x}
          cy={coords[coords.length - 1].y}
          r="3.5"
          fill="var(--adoniz-electric-lime)"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.0, ease: EASE }}
        />
      </svg>
      {/* X-axis labels */}
      <div className="flex justify-between mt-1" style={{ paddingLeft: `${pad}px`, paddingRight: `${pad}px` }}>
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
          <span key={d} style={{ fontSize: "8px", fontFamily: "var(--font-sans)", color: "rgba(0,0,0,0.3)" }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Theme tag cloud ─────────────────────────────────────────────────────── */
function ThemeTags() {
  const themes = [
    { l: "Checkout flow", s: "lg" },
    { l: "Subscription billing", s: "sm" },
    { l: "Mobile UX", s: "sm" },
    { l: "Onboarding", s: "lg" },
    { l: "Apple Pay", s: "sm" },
    { l: "CSV export", s: "sm" },
  ];
  return (
    <div className="flex flex-wrap gap-1.5 mt-4">
      {themes.map((t) => (
        <div
          key={t.l}
          className="rounded-full"
          style={{
            padding: t.s === "lg" ? "6px 14px" : "4px 10px",
            fontSize: t.s === "lg" ? "12px" : "11px",
            fontFamily: "var(--font-sans)",
            background: t.s === "lg" ? "var(--adoniz-forest)" : "var(--adoniz-mist)",
            color: t.s === "lg" ? "var(--adoniz-fluorescent)" : "var(--adoniz-forest)",
            fontWeight: t.s === "lg" ? 600 : 400,
            border: t.s === "lg" ? "none" : "1px solid var(--adoniz-distant-cloud)",
          }}
        >
          {t.l}
        </div>
      ))}
    </div>
  );
}

/* ─── Summary snippet ─────────────────────────────────────────────────────── */
function SummarySnippet() {
  return (
    <div className="mt-4 rounded-xl p-3" style={{ background: "var(--adoniz-mist)", border: "1px solid var(--adoniz-distant-cloud)" }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22C55E" }} />
        <span style={{ fontSize: "9px", fontFamily: "var(--font-sans)", fontWeight: 600, color: "var(--adoniz-forest)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Positive · Feature Request
        </span>
      </div>
      <p style={{ fontSize: "12px", fontFamily: "var(--font-sans)", color: "rgba(0,0,0,0.62)", lineHeight: 1.5 }}>
        Customer requesting bulk export of order history to CSV — needed for accounting integrations.
      </p>
    </div>
  );
}

/* ─── PII chip strip ──────────────────────────────────────────────────────── */
function PIIChips() {
  const items = ["john@example.com", "store-xyz.myshopify.com", "+1 555-0123", "cus_abc123"];
  return (
    <div className="flex flex-wrap gap-1.5 mt-4">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{ background: "rgba(0,61,49,0.06)", border: "1px solid rgba(0,61,49,0.12)" }}
        >
          <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--adoniz-forest)", textDecoration: "line-through", opacity: 0.55 }}>
            {item}
          </span>
          <span style={{ fontSize: "8px", color: "#22C55E", fontWeight: 700 }}>✓</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Q&A chat mini ───────────────────────────────────────────────────────── */
function QAChat() {
  return (
    <div className="flex flex-col gap-2 mt-4">
      {[
        { from: "user", text: "Top 3 issues this week?" },
        { from: "ai", text: "1. Apple Pay failures (14) · 2. Renewal date bug (9) · 3. Mobile layout shift (7)" },
        { from: "user", text: "Sentiment trend?" },
        { from: "ai", text: "Positive up 12% this week. 3 new negative themes around billing." },
      ].map((msg, i) => (
        <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className="rounded-2xl px-3 py-1.5 max-w-[88%]"
            style={{
              background: msg.from === "user"
                ? "rgba(255,255,255,0.1)"
                : "rgba(209,248,67,0.12)",
              border: msg.from === "ai" ? "1px solid rgba(209,248,67,0.2)" : "none",
              fontSize: "11px",
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.82)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Individual feature card ─────────────────────────────────────────────── */
interface CardProps {
  overline: string;
  title: string;
  description: string;
  dark?: boolean;
  muted?: boolean;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  logos?: { name: string; file: string }[];
  image?: string;
}

function FeatureCard({ overline, title, description, dark, muted, children, className = "", delay = 0, logos, image }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`flex flex-col p-7 ${className}`}
      style={{
        background: dark ? "var(--adoniz-pine)" : muted ? "rgba(0,61,49,0.03)" : "#FFFFFF",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          textTransform: "uppercase" as const,
          letterSpacing: "0.1em",
          color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)",
          marginBottom: "8px",
        }}
      >
        {overline}
      </span>
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "20px",
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
          color: dark ? "#FFFFFF" : "var(--adoniz-forest)",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          lineHeight: 1.6,
          color: dark ? "rgba(255,255,255,0.52)" : "rgba(0,0,0,0.52)",
        }}
      >
        {description}
      </p>

      {/* Real integration logos */}
      {logos && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {logos.map((logo) => (
            <div key={logo.name} className="flex flex-col items-center gap-1">
              <div
                className="relative flex items-center justify-center rounded-xl overflow-hidden"
                style={{
                  width: "40px",
                  height: "40px",
                  background: "var(--adoniz-lighthouse)",
                  border: "1px solid var(--adoniz-distant-cloud)",
                  padding: "6px",
                }}
              >
                <Image
                  src={`/logos/${logo.file}`}
                  alt={logo.name}
                  width={28}
                  height={28}
                  style={{ objectFit: "contain", width: "100%", height: "auto" }}
                />
              </div>
              <span style={{ fontSize: "9px", fontFamily: "var(--font-sans)", color: "rgba(0,0,0,0.4)" }}>{logo.name}</span>
            </div>
          ))}
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: "40px",
              height: "40px",
              background: "var(--adoniz-mist)",
              border: "1px solid var(--adoniz-distant-cloud)",
              fontSize: "10px",
              color: "var(--adoniz-forest)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
            }}
          >
            +17
          </div>
        </div>
      )}

      {image && (
        <img
          src={image}
          alt="Ask Your Data interface"
          style={{ width: "100%", height: "auto", borderRadius: "8px", marginTop: "12px", marginBottom: "12px", display: "block" }}
        />
      )}

      {children && <div className="mt-auto pt-2">{children}</div>}
    </motion.div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */
export function FeaturesSection() {
  const ingestion = FEATURES.find((f) => f.id === "ingestion")!;
  const pii       = FEATURES.find((f) => f.id === "pii")!;
  const qa        = FEATURES.find((f) => f.id === "qa")!;
  const sentiment = FEATURES.find((f) => f.id === "sentiment")!;
  const themes    = FEATURES.find((f) => f.id === "themes")!;
  const summaries = FEATURES.find((f) => f.id === "summaries")!;

  return (
    <section id="features" className="relative pt-14 pb-10 lg:pt-16 lg:pb-12 px-6" style={{ background: "var(--adoniz-snow)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="inline-flex items-center rounded-full px-4 py-1.5 mb-5"
              style={{
                background: "var(--adoniz-fluorescent)",
                fontSize: "11px",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                textTransform: "uppercase" as const,
                letterSpacing: "0.1em",
                color: "var(--adoniz-pine)",
              }}
            >
              Features
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)",
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
                color: "var(--adoniz-forest)",
              }}
            >
              The intelligence layer your<br />product team is missing
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: "13px",
              fontFamily: "var(--font-sans)",
              fontStyle: "italic",
              color: "rgba(0,0,0,0.38)",
            }}
          >
            Built for PMs who ship.
          </motion.p>
        </div>

        {/* Zero-gap bento grid */}
        <div
          className="overflow-hidden"
          style={{
            borderRadius: "20px",
            border: "1px solid var(--adoniz-distant-cloud)",
            boxShadow: "0 4px 24px rgba(0,61,49,0.06)",
          }}
        >
          <div
            className="bento-grid grid"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0",
              alignItems: "stretch",
            }}
          >
            {/* Row 1: Ingestion (2col) + PII (1col) + Q&A (1col, 2row) */}
            <div style={{ gridColumn: "1 / 3", borderRight: "1px solid var(--adoniz-distant-cloud)", borderBottom: "1px solid var(--adoniz-distant-cloud)" }}>
              <FeatureCard {...ingestion} logos={"logos" in ingestion ? ingestion.logos as { name: string; file: string }[] : undefined} delay={0} />
            </div>
            <div style={{ gridColumn: "3 / 4", borderRight: "1px solid var(--adoniz-distant-cloud)", borderBottom: "1px solid var(--adoniz-distant-cloud)" }}>
              <FeatureCard {...pii} delay={0.08}>
                <PIIChips />
              </FeatureCard>
            </div>
            {/* Q&A tall card — spans 2 rows */}
            <div style={{ gridColumn: "4 / 5", gridRow: "1 / 3", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <FeatureCard {...qa} dark delay={0.12} className="h-full" image="/images/ask-your-data.png">
                <QAChat />
              </FeatureCard>
            </div>

            {/* Row 2: Sentiment (2col) + Themes (1col) */}
            <div style={{ gridColumn: "1 / 3", borderRight: "1px solid var(--adoniz-distant-cloud)", borderBottom: "1px solid var(--adoniz-distant-cloud)" }}>
              <FeatureCard {...sentiment} delay={0.16}>
                <SentimentChart />
              </FeatureCard>
            </div>
            <div style={{ gridColumn: "3 / 4", borderRight: "1px solid var(--adoniz-distant-cloud)", borderBottom: "1px solid var(--adoniz-distant-cloud)" }}>
              <FeatureCard {...themes} delay={0.2}>
                <ThemeTags />
              </FeatureCard>
            </div>

            {/* Row 3: Summaries (2col) + empty spacer that's hidden on row 3 */}
            <div style={{ gridColumn: "1 / 3", borderRight: "1px solid var(--adoniz-distant-cloud)" }}>
              <FeatureCard {...summaries} delay={0.24}>
                <SummarySnippet />
              </FeatureCard>
            </div>
            {/* Filler to complete the row visually — hidden on mobile via .bento-filler */}
            <div className="bento-filler" style={{ gridColumn: "3 / 4", borderRight: "1px solid var(--adoniz-distant-cloud)", background: "rgba(0,61,49,0.02)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
