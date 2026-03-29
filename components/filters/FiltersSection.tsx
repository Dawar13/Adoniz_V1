"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FILTER_CATEGORIES, MOCK_CONVERSATIONS } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

const SENTIMENT_META: Record<string, { dot: string; bg: string; label: string }> = {
  positive: { dot: "#22C55E", bg: "rgba(34,197,94,0.1)", label: "Positive" },
  negative: { dot: "#EF4444", bg: "rgba(239,68,68,0.1)", label: "Negative" },
  neutral:  { dot: "#F59E0B", bg: "rgba(245,158,11,0.1)", label: "Neutral" },
};

/* ─── Feature points as stacked table boxes ──────────────────────────────── */
const FEATURE_POINTS = [
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 flex-shrink-0" stroke="var(--adoniz-forest)" strokeWidth="1.5">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
    text: "Auto-categorized on ingestion",
  },
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 flex-shrink-0" stroke="var(--adoniz-forest)" strokeWidth="1.5">
        <path d="M8 2L3 5v4c0 3 2 5 5 5s5-2 5-5V5L8 2z" />
        <path d="M6 8l1.5 1.5L10 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "PII stripped before analysis",
  },
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 flex-shrink-0" stroke="var(--adoniz-forest)" strokeWidth="1.5">
        <path d="M2 8h12M8 2v12" strokeLinecap="round" />
        <circle cx="8" cy="8" r="6" />
      </svg>
    ),
    text: "Ask questions about any category",
  },
];

export function FiltersSection() {
  const [active, setActive] = useState<string[]>(["Error / Bug", "Feature Request"]);

  const toggle = (label: string) =>
    setActive((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );

  const visible = MOCK_CONVERSATIONS.filter((c) =>
    active.length === 0 ? true : active.includes(c.category)
  );

  return (
    <section
      id="how-it-works"
      className="relative py-24 lg:py-32 px-6 overflow-hidden"
      style={{ background: "var(--adoniz-snow)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="inline-flex items-center rounded-full px-4 py-1.5 mb-6"
              style={{
                background: "rgba(0,61,49,0.07)",
                border: "1px solid rgba(0,61,49,0.12)",
                fontSize: "11px",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                textTransform: "uppercase" as const,
                letterSpacing: "0.1em",
                color: "var(--adoniz-forest)",
              }}
            >
              Smart Categorization
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
                color: "var(--adoniz-pine)",
                marginBottom: "18px",
              }}
            >
              See the signal{" "}
              <em style={{ fontStyle: "italic" }}>in the noise.</em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1rem, 1.5vw, 1.05rem)",
                color: "rgba(0,0,0,0.52)",
                lineHeight: 1.65,
                maxWidth: "420px",
                marginBottom: "32px",
              }}
            >
              Every conversation is automatically bucketed into Error/Bug, Feature Request,
              Escalation, Billing, and more. Filter, drill down, and find patterns —
              without reading a single chat.
            </motion.p>

            {/* Stacked table-style feature points */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="overflow-hidden"
              style={{
                maxWidth: "380px",
                borderRadius: "12px",
                border: "1px solid var(--adoniz-distant-cloud)",
              }}
            >
              {FEATURE_POINTS.map((fp, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                  style={{
                    padding: "14px 20px",
                    borderBottom: i < FEATURE_POINTS.length - 1 ? "1px solid var(--adoniz-distant-cloud)" : "none",
                    background: "#fff",
                  }}
                >
                  {fp.icon}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "rgba(0,0,0,0.65)",
                    }}
                  >
                    {fp.text}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              className="mt-8"
            >
              <button
                className="rounded-full font-bold transition-all duration-250"
                style={{
                  background: "var(--adoniz-pine)",
                  color: "#fff",
                  padding: "14px 32px",
                  fontSize: "15px",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "var(--adoniz-forest)";
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = "0 8px 24px rgba(0,61,49,0.2)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "var(--adoniz-pine)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                Get Early Access →
              </button>
            </motion.div>
          </div>

          {/* Right — interactive filter UI */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "#fff",
                border: "1px solid var(--adoniz-distant-cloud)",
                boxShadow: "0 24px 64px rgba(0,61,49,0.09)",
              }}
            >
              {/* Fake browser bar */}
              <div
                className="flex items-center gap-2 px-5 py-3"
                style={{ background: "var(--adoniz-lighthouse)", borderBottom: "1px solid var(--adoniz-distant-cloud)" }}
              >
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                ))}
                <div
                  className="flex-1 ml-3 rounded-full px-3 py-1"
                  style={{ background: "var(--adoniz-mist)", fontSize: "11px", color: "rgba(0,0,0,0.35)", fontFamily: "var(--font-sans)" }}
                >
                  app.adoniz.io/conversations
                </div>
              </div>

              {/* Filter pills */}
              <div className="px-5 pt-4 pb-3">
                <p style={{ fontSize: "10px", fontFamily: "var(--font-sans)", fontWeight: 600, color: "rgba(0,0,0,0.35)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "10px" }}>
                  Filter by category
                </p>
                <div className="filter-pills-row flex flex-wrap gap-2">
                  {FILTER_CATEGORIES.map((cat) => {
                    const isActive = active.includes(cat.label);
                    return (
                      <button
                        key={cat.label}
                        onClick={() => toggle(cat.label)}
                        className="rounded-full transition-all duration-200"
                        style={{
                          padding: "6px 14px",
                          fontSize: "12px",
                          fontFamily: "var(--font-sans)",
                          fontWeight: isActive ? 600 : 400,
                          background: isActive ? "var(--adoniz-electric-lime)" : "var(--adoniz-mist)",
                          color: isActive ? "var(--adoniz-pine)" : "rgba(0,0,0,0.5)",
                          border: isActive ? "none" : "1px solid var(--adoniz-distant-cloud)",
                          cursor: "pointer",
                        }}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conversation list */}
              <div className="px-5 pb-5 flex flex-col gap-2">
                <p style={{ fontSize: "10px", fontFamily: "var(--font-sans)", fontWeight: 600, color: "rgba(0,0,0,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", paddingTop: "4px" }}>
                  {visible.length} conversations
                </p>

                {visible.map((conv, i) => {
                  const s = SENTIMENT_META[conv.sentiment];
                  return (
                    <motion.div
                      key={`${conv.category}-${i}`}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE, delay: i * 0.04 }}
                      className="rounded-2xl p-4"
                      style={{
                        background: "var(--adoniz-lighthouse)",
                        border: "1px solid var(--adoniz-distant-cloud)",
                      }}
                      whileHover={{ boxShadow: "0 4px 16px rgba(0,61,49,0.07)" }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                        <span className="rounded-full px-2 py-0.5" style={{ fontSize: "10px", fontFamily: "var(--font-sans)", fontWeight: 600, background: s.bg, color: s.dot }}>
                          {s.label}
                        </span>
                        <span className="rounded-full px-2 py-0.5" style={{ fontSize: "10px", fontFamily: "var(--font-sans)", fontWeight: 500, background: "rgba(0,61,49,0.07)", color: "var(--adoniz-forest)" }}>
                          {conv.category}
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", fontFamily: "var(--font-sans)", color: "rgba(0,0,0,0.62)", lineHeight: 1.5 }}>
                        {conv.summary}
                      </p>
                    </motion.div>
                  );
                })}

                {visible.length === 0 && (
                  <div className="text-center py-8">
                    <span style={{ fontSize: "13px", fontFamily: "var(--font-sans)", color: "rgba(0,0,0,0.3)" }}>
                      No categories selected
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
