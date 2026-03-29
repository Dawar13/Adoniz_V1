"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DEVICE_QUOTE, MARQUEE_ITEMS } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Count-up animation ──────────────────────────────────────────────────── */
function CountUp({ to, duration = 1.4, suffix = "" }: { to: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const run = (now: number) => {
      const t = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * to));
      if (t < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [inView, to, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Animated Q&A with auto-cursor click ────────────────────────────────── */
type Phase = "idle" | "typing" | "loading" | "response" | "cursor" | "analytics";

const QUERY_TEXT = "What are the top issues this week?";
const AI_RESPONSE_ITEMS = [
  { label: "Checkout errors",   pct: 23, color: "var(--adoniz-electric-lime)" },
  { label: "Billing confusion", pct: 18, color: "rgba(0,88,64,0.55)" },
  { label: "iOS 17 crashes",    pct: 12, color: "rgba(0,88,64,0.32)" },
];

function AnimatedQA() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let t: NodeJS.Timeout;

    if (phase === "idle") {
      setTyped(0);
      t = setTimeout(() => setPhase("typing"), 1400);
    } else if (phase === "typing") {
      setTyped(0);
      let i = 0;
      intervalRef.current = setInterval(() => {
        i++;
        setTyped(i);
        if (i >= QUERY_TEXT.length) {
          clearInterval(intervalRef.current!);
          t = setTimeout(() => setPhase("loading"), 220);
        }
      }, 30); // fast typing
    } else if (phase === "loading") {
      t = setTimeout(() => setPhase("response"), 580);
    } else if (phase === "response") {
      t = setTimeout(() => setPhase("cursor"), 2000);
    } else if (phase === "cursor") {
      t = setTimeout(() => setPhase("analytics"), 1200);
    } else if (phase === "analytics") {
      t = setTimeout(() => setPhase("idle"), 3200);
    }

    return () => {
      clearInterval(intervalRef.current!);
      clearTimeout(t);
    };
  }, [phase]);

  const showResponse = phase === "response" || phase === "cursor";

  return (
    <div className="flex flex-col gap-2" style={{ position: "relative" }}>
      {/* Idle: placeholder */}
      {phase === "idle" && (
        <div className="flex items-center gap-1 mt-1">
          <span style={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "rgba(0,0,0,0.28)", fontStyle: "italic" }}>
            Ask a question
          </span>
          <span className="typing-cursor" style={{ color: "var(--adoniz-forest)", fontSize: "11px" }}>|</span>
        </div>
      )}

      {/* User bubble */}
      {phase !== "idle" && (
        <div className="flex justify-end">
          <div
            className="rounded-2xl rounded-br-sm px-3 py-2 max-w-[88%]"
            style={{
              background: "var(--adoniz-mist)",
              border: "1px solid var(--adoniz-distant-cloud)",
              fontSize: "10.5px",
              fontFamily: "var(--font-sans)",
              color: "rgba(0,0,0,0.72)",
              lineHeight: 1.5,
            }}
          >
            {phase === "typing" ? (
              <>
                {QUERY_TEXT.slice(0, typed)}
                <span className="typing-cursor" style={{ color: "var(--adoniz-forest)" }}>|</span>
              </>
            ) : QUERY_TEXT}
          </div>
        </div>
      )}

      {/* Loading dots */}
      {phase === "loading" && (
        <div className="flex justify-start">
          <div
            className="rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-1.5"
            style={{ background: "rgba(0,61,49,0.05)", border: "1px solid rgba(0,61,49,0.1)" }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="rounded-full"
                style={{ width: "5px", height: "5px", background: "var(--adoniz-forest)" }}
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                transition={{ duration: 0.55, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      )}

      {/* AI Response — shown in both response + cursor phases */}
      {showResponse && (
        <motion.div
          className="flex justify-start"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div
            className="rounded-2xl rounded-bl-sm px-3 py-2.5 max-w-[94%]"
            style={{ background: "rgba(0,88,64,0.05)", border: "1px solid rgba(0,88,64,0.1)" }}
          >
            <p style={{ fontSize: "9.5px", fontFamily: "var(--font-sans)", fontWeight: 600, color: "var(--adoniz-forest)", marginBottom: "5px", lineHeight: 1.4 }}>
              Based on 847 conversations this week:
            </p>
            <ul className="flex flex-col gap-1.5 m-0 p-0 list-none">
              {AI_RESPONSE_ITEMS.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i + 0.05, ease: EASE }}
                  style={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "rgba(0,0,0,0.65)", lineHeight: 1.45 }}
                  className="flex items-center gap-1.5"
                >
                  <span style={{ color: "var(--adoniz-forest)", fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>
                  {item.label} — {item.pct}%
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, ease: EASE }}
              className="mt-2"
            >
              <motion.span
                style={{
                  fontSize: "9px",
                  fontFamily: "var(--font-sans)",
                  color: "var(--adoniz-forest)",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                  display: "inline-block",
                  padding: "1px 3px",
                  borderRadius: "3px",
                }}
                animate={phase === "cursor" ? {
                  background: "rgba(0,88,64,0.08)",
                  color: "var(--adoniz-pine)",
                } : {}}
                transition={{ duration: 0.15 }}
              >
                View Analytics →
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Auto-cursor — appears during cursor phase and "clicks" View Analytics */}
      {phase === "cursor" && (
        <motion.div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "16px",
            zIndex: 20,
            pointerEvents: "none",
          }}
          initial={{ opacity: 0, x: 28, y: 18 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ scale: [1, 0.6, 1.1, 1] }}
            transition={{ duration: 0.26, delay: 0.55, ease: "easeInOut" }}
          >
            <svg width="13" height="17" viewBox="0 0 13 17" fill="none">
              <path
                d="M2 2L2 13L5 10.5H9L2 2Z"
                fill="#1a1a1a"
                stroke="white"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* Analytics view */}
      {phase === "analytics" && (
        <motion.div
          className="flex justify-start"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <div
            className="rounded-2xl rounded-bl-sm px-3 py-2.5 w-full"
            style={{ background: "rgba(0,88,64,0.05)", border: "1px solid rgba(0,88,64,0.1)" }}
          >
            <span style={{ fontSize: "9px", fontFamily: "var(--font-sans)", fontWeight: 600, color: "var(--adoniz-forest)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>
              Issue Volume · This Week
            </span>
            {AI_RESPONSE_ITEMS.map((item, i) => (
              <div key={item.label} className="flex items-center gap-1.5 mb-1.5">
                <span style={{ fontSize: "8.5px", fontFamily: "var(--font-sans)", color: "rgba(0,0,0,0.48)", width: "64px", flexShrink: 0 }}>{item.label}</span>
                <div className="flex-1 rounded-full overflow-hidden" style={{ height: "5px", background: "var(--adoniz-mist)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct * 3.2}px` }}
                    transition={{ duration: 0.55, delay: 0.06 * i, ease: EASE }}
                  />
                </div>
                <span style={{ fontSize: "8.5px", fontFamily: "var(--font-mono)", color: "rgba(0,0,0,0.5)", width: "18px", textAlign: "right" }}>{item.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── White Dashboard (Laptop) ────────────────────────────────────────────── */
function WhiteDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { raw: 2847, label: "Conversations", indicator: null,    suffix: ""  },
    { raw: 72,   label: "Positive",      indicator: "lime",  suffix: "%" },
    { raw: 14,   label: "Themes Found",  indicator: "lime",  suffix: ""  },
    { raw: 23,   label: "Action Items",  indicator: "amber", suffix: ""  },
  ];

  const bars = [
    { l: "Feature Req.", p: 82, c: "var(--adoniz-electric-lime)" },
    { l: "Error/Bug",    p: 64, c: "var(--adoniz-june-ivy)" },
    { l: "Escalation",  p: 38, c: "rgba(0,61,49,0.35)" },
    { l: "Billing",     p: 24, c: "rgba(0,61,49,0.18)" },
  ];

  const recentConvos = [
    { s: "neg", cat: "Error/Bug",    text: "Apple Pay fails on mobile Safari — 3 accounts affected" },
    { s: "pos", cat: "Feature Req.", text: "Bulk CSV export of orders needed for accounting" },
    { s: "neg", cat: "Billing",      text: "Subscription shows wrong renewal date after upgrade" },
  ];

  return (
    <div ref={ref} className="w-full h-full flex flex-col overflow-hidden" style={{ fontFamily: "var(--font-sans)", background: "#fff" }}>
      {/* macOS chrome */}
      <div
        className="flex items-center gap-1.5 px-3 flex-shrink-0"
        style={{ height: "24px", background: "var(--adoniz-lighthouse)", borderBottom: "1px solid var(--adoniz-distant-cloud)" }}
      >
        {[{ c: "#FF5F57" }, { c: "#FFBD2E" }, { c: "#28C840" }].map((d, i) => (
          <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: d.c }} />
        ))}
        <div className="flex items-center gap-1 mx-auto">
          <div className="rounded" style={{ width: "12px", height: "12px", background: "rgba(0,61,49,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--adoniz-fluorescent)", opacity: 0.8 }} />
          </div>
          <span style={{ fontSize: "8.5px", color: "rgba(0,0,0,0.32)" }}>app.adoniz.io/dashboard</span>
        </div>
      </div>

      {/* Sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className="flex flex-col gap-0.5 py-2.5 px-2 flex-shrink-0"
          style={{ width: "130px", background: "var(--adoniz-pine)", borderRight: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-1.5 px-2 py-1.5 mb-2">
            <div className="w-3.5 h-3.5 rounded flex items-center justify-center" style={{ background: "rgba(240,255,61,0.15)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--adoniz-fluorescent)" }} />
            </div>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "10.5px", color: "#fff", letterSpacing: "-0.01em" }}>Adoniz</span>
          </div>
          {[
            { label: "Dashboard",     active: true,  badge: null },
            { label: "Conversations", active: false, badge: "4" },
            { label: "Themes",        active: false, badge: null },
            { label: "Reports",       active: false, badge: null },
            { label: "Integrations",  active: false, badge: null },
            { label: "Settings",      active: false, badge: null },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-2 py-1.5 rounded cursor-pointer"
              style={{
                background: item.active ? "rgba(209,248,67,0.1)" : "transparent",
                borderLeft: item.active ? "2px solid var(--adoniz-electric-lime)" : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: "9.5px", color: item.active ? "#fff" : "rgba(255,255,255,0.42)", fontWeight: item.active ? 600 : 400 }}>
                {item.label}
              </span>
              {item.badge && (
                <div className="rounded-full px-1 py-px" style={{ background: "#F59E0B", fontSize: "7px", color: "#fff", fontWeight: 700, lineHeight: 1.4 }}>
                  {item.badge}
                </div>
              )}
            </div>
          ))}

          {/* Workspace section */}
          <div className="mt-auto px-2 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: "7px", color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>AC</span>
              </div>
              <div>
                <span style={{ fontSize: "8.5px", color: "rgba(255,255,255,0.55)", display: "block" }}>Acme Corp</span>
                <span style={{ fontSize: "7px", color: "rgba(255,255,255,0.28)" }}>Pro Plan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col py-2.5 px-3 overflow-hidden gap-2 bg-white">
          {/* Top bar */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div>
              <span style={{ fontSize: "11.5px", fontFamily: "var(--font-sans)", fontWeight: 700, color: "#000" }}>Dashboard</span>
              <span style={{ fontSize: "9px", color: "rgba(0,0,0,0.35)", marginLeft: "8px" }}>Last sync 2 min ago</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="rounded-full px-2 py-0.5"
                style={{ background: "var(--adoniz-lighthouse)", border: "1px solid var(--adoniz-distant-cloud)", fontSize: "8.5px", color: "rgba(0,0,0,0.45)", fontFamily: "var(--font-sans)" }}
              >
                Last 30 days ▾
              </div>
              <div
                className="rounded-full px-2 py-0.5"
                style={{ background: "rgba(209,248,67,0.12)", border: "1px solid rgba(209,248,67,0.3)", fontSize: "8.5px", color: "var(--adoniz-forest)", fontFamily: "var(--font-sans)", fontWeight: 600 }}
              >
                + New report
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-1.5 flex-shrink-0">
            {stats.map((stat, idx) => (
              <div key={stat.label} className="rounded-lg p-2" style={{ background: "#fff", border: "1px solid var(--adoniz-distant-cloud)" }}>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1">
                    {stat.indicator && (
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: stat.indicator === "lime" ? "var(--adoniz-electric-lime)" : "#F59E0B" }} />
                    )}
                    <span style={{ fontSize: "12.5px", fontFamily: "var(--font-sans)", fontWeight: 700, color: "#000" }}>
                      {inView ? <CountUp to={stat.raw} suffix={stat.suffix} duration={1.2 + idx * 0.1} /> : "0"}
                    </span>
                  </div>
                  <span style={{ fontSize: "7px", color: "#22C55E", fontWeight: 600 }}>
                    {["↑12%", "↑5%", "+3", "↑8%"][idx]}
                  </span>
                </div>
                <span style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.38)", fontFamily: "var(--font-sans)" }}>{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="flex gap-2 flex-shrink-0" style={{ height: "68px" }}>
            {/* Donut */}
            <div className="flex items-center gap-2 rounded-lg p-2 flex-1" style={{ border: "1px solid var(--adoniz-distant-cloud)" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              >
                <svg viewBox="0 0 48 48" className="w-9 h-9 flex-shrink-0">
                  <circle cx="24" cy="24" r="16" fill="none" strokeWidth="7" stroke="var(--adoniz-mist)" />
                  <circle cx="24" cy="24" r="16" fill="none" strokeWidth="7" stroke="var(--adoniz-electric-lime)"
                    strokeDasharray={`${0.72 * 100.5} ${100.5}`} strokeLinecap="round" transform="rotate(-90 24 24)" />
                  <circle cx="24" cy="24" r="16" fill="none" strokeWidth="7" stroke="var(--adoniz-june-ivy)"
                    strokeDasharray={`${0.18 * 100.5} ${100.5}`} strokeDashoffset={`${-0.72 * 100.5}`} strokeLinecap="round" transform="rotate(-90 24 24)" />
                  <text x="24" y="27" textAnchor="middle" fontSize="8" fill="var(--adoniz-pine)" fontWeight="700">72%</text>
                </svg>
              </motion.div>
              <div className="flex flex-col gap-0.5">
                <span style={{ fontSize: "8px", fontFamily: "var(--font-sans)", fontWeight: 600, color: "rgba(0,0,0,0.5)", marginBottom: "2px" }}>Sentiment</span>
                {[
                  { c: "var(--adoniz-electric-lime)", l: "Positive 72%" },
                  { c: "var(--adoniz-june-ivy)",      l: "Neutral 18%" },
                  { c: "rgba(0,0,0,0.18)",             l: "Negative 10%" },
                ].map((s) => (
                  <div key={s.l} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.c }} />
                    <span style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.45)", fontFamily: "var(--font-sans)" }}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category bars */}
            <div className="flex flex-col gap-1 rounded-lg p-2 flex-1 justify-center" style={{ border: "1px solid var(--adoniz-distant-cloud)" }}>
              <span style={{ fontSize: "7.5px", fontWeight: 600, color: "rgba(0,0,0,0.4)", marginBottom: "2px" }}>Top Categories</span>
              {bars.map((item, idx) => (
                <div key={item.l} className="flex items-center gap-1.5">
                  <span style={{ fontSize: "7px", color: "rgba(0,0,0,0.42)", fontFamily: "var(--font-sans)", width: "52px", flexShrink: 0 }}>{item.l}</span>
                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: "4px", background: "var(--adoniz-mist)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.c }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${item.p}%` } : {}}
                      transition={{ duration: 0.8, delay: 0.4 + 0.1 * idx, ease: EASE }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent conversations */}
          <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ border: "1px solid var(--adoniz-distant-cloud)" }}>
            <div className="flex items-center justify-between px-2.5 py-1.5" style={{ borderBottom: "1px solid var(--adoniz-distant-cloud)", background: "var(--adoniz-lighthouse)" }}>
              <span style={{ fontSize: "8px", fontFamily: "var(--font-sans)", fontWeight: 600, color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Recent
              </span>
              <span style={{ fontSize: "7.5px", fontFamily: "var(--font-sans)", color: "var(--adoniz-forest)", cursor: "pointer" }}>View all →</span>
            </div>
            <div className="flex flex-col">
              {recentConvos.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-2.5 py-1.5"
                  style={{ borderBottom: i < recentConvos.length - 1 ? "1px solid var(--adoniz-distant-cloud)" : "none" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.s === "pos" ? "#22C55E" : c.s === "neg" ? "#EF4444" : "#F59E0B" }} />
                  <span style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.4)", width: "52px", flexShrink: 0, fontFamily: "var(--font-sans)" }}>{c.cat}</span>
                  <span style={{ fontSize: "8px", color: "rgba(0,0,0,0.62)", fontFamily: "var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Q&A section */}
          <div className="flex-1 rounded-lg p-2.5 overflow-hidden min-h-0" style={{ border: "1px solid var(--adoniz-distant-cloud)" }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--adoniz-electric-lime)" }} />
              <span style={{ fontSize: "8px", fontFamily: "var(--font-sans)", fontWeight: 600, color: "var(--adoniz-forest)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Ask Adoniz
              </span>
              <div className="ml-auto rounded-full px-1.5 py-px" style={{ background: "rgba(0,61,49,0.06)", fontSize: "7px", color: "rgba(0,0,0,0.4)" }}>
                AI
              </div>
            </div>
            <AnimatedQA />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Phone content ────────────────────────────────────────────────────────── */
function PhoneContent() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const convos = [
    { s: "neg", cat: "Error",   text: "Apple Pay fails on mobile Safari" },
    { s: "pos", cat: "Feature", text: "Bulk CSV export for accounting" },
  ];

  return (
    <div ref={ref} className="w-full h-full flex flex-col" style={{ fontFamily: "var(--font-sans)", background: "#F9FAFB" }}>
      {/* Status bar + header */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--adoniz-distant-cloud)" }}>
        <div className="flex items-center justify-between px-4 pt-10 pb-0.5">
          <span style={{ fontSize: "8px", fontWeight: 700, color: "#000" }}>9:41</span>
          <div className="flex items-center gap-0.5">
            {/* signal */}
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <rect x="0" y="4" width="2" height="4" rx="0.5" fill="#000" opacity="0.5"/>
              <rect x="2.5" y="2.5" width="2" height="5.5" rx="0.5" fill="#000" opacity="0.7"/>
              <rect x="5" y="1" width="2" height="7" rx="0.5" fill="#000" opacity="0.85"/>
              <rect x="7.5" y="0" width="2" height="8" rx="0.5" fill="#000"/>
            </svg>
            {/* wifi */}
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M5 6.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z" fill="#000"/>
              <path d="M2.5 4.5A3.7 3.7 0 0 1 5 3.5c.93 0 1.78.35 2.5.9" stroke="#000" strokeWidth="1" strokeLinecap="round"/>
              <path d="M1 2.5A5.95 5.95 0 0 1 5 1c1.56 0 2.98.6 4 1.5" stroke="#000" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            </svg>
            {/* battery */}
            <div style={{ width: "16px", height: "8px", border: "1px solid rgba(0,0,0,0.5)", borderRadius: "2px", position: "relative", display: "flex", alignItems: "center", padding: "1px" }}>
              <div style={{ width: "80%", height: "100%", background: "#000", borderRadius: "1px" }} />
              <div style={{ position: "absolute", right: "-3px", top: "2px", width: "2px", height: "4px", background: "rgba(0,0,0,0.4)", borderRadius: "0 1px 1px 0" }} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-1.5">
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#000" }}>Overview</span>
          <div className="flex items-center gap-1.5">
            <div className="rounded-full px-1.5 py-0.5" style={{ background: "var(--adoniz-mist)", border: "1px solid var(--adoniz-distant-cloud)", fontSize: "7.5px", color: "var(--adoniz-forest)", fontWeight: 600 }}>
              Today ▾
            </div>
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--adoniz-mist)", position: "relative" }}>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M4.5 1v7M1.5 4.5h6" stroke="var(--adoniz-forest)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats 2×2 grid */}
      <div className="grid grid-cols-2 gap-1.5 p-2 flex-shrink-0">
        {[
          { raw: 2847, v: null, l: "Conversations", delta: "+12%", pos: true,  dot: null },
          { raw: 72,   v: null, l: "Positive",      delta: "+5%",  pos: true,  dot: "lime", suffix: "%" },
          { raw: 14,   v: null, l: "Themes",         delta: "+3",   pos: true,  dot: "lime" },
          { raw: 8,    v: null, l: "Action Items",   delta: "2 urgent", pos: false, dot: "amber" },
        ].map((s) => (
          <div key={s.l} className="rounded-lg p-2" style={{ border: "1px solid var(--adoniz-distant-cloud)", background: "#fff" }}>
            <div className="flex items-baseline gap-1 flex-wrap">
              {s.dot && (
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mb-0.5" style={{ background: s.dot === "lime" ? "var(--adoniz-electric-lime)" : "#F59E0B" }} />
              )}
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#000", lineHeight: 1 }}>
                {inView ? <CountUp to={s.raw} suffix={s.suffix ?? ""} duration={1.1} /> : "0"}
              </span>
              <span style={{ fontSize: "7px", color: s.pos ? "#22C55E" : "#F59E0B", fontWeight: 600 }}>{s.delta}</span>
            </div>
            <span style={{ fontSize: "8px", color: "rgba(0,0,0,0.4)" }}>{s.l}</span>
          </div>
        ))}
      </div>

      {/* Mini bar chart */}
      <div className="mx-2 rounded-lg p-2 flex-shrink-0" style={{ border: "1px solid var(--adoniz-distant-cloud)", background: "#fff" }}>
        <div className="flex items-center justify-between mb-1.5">
          <span style={{ fontSize: "7.5px", fontWeight: 600, color: "var(--adoniz-forest)" }}>Sentiment · 7d</span>
          <span style={{ fontSize: "7px", color: "rgba(0,0,0,0.35)" }}>↑ trending positive</span>
        </div>
        <div className="flex items-end gap-0.5" style={{ height: "28px" }}>
          {[55, 62, 70, 65, 80, 88, 72].map((v, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{ background: i === 5 ? "var(--adoniz-electric-lime)" : `rgba(0,88,64,${0.18 + i * 0.08})` }}
              initial={{ height: 0 }}
              animate={inView ? { height: `${v}%` } : {}}
              transition={{ duration: 0.45, delay: 0.08 * i, ease: EASE }}
            />
          ))}
        </div>
      </div>

      {/* Trending topics row */}
      <div className="px-2 pt-2 flex-shrink-0">
        <span style={{ fontSize: "7.5px", fontWeight: 600, color: "rgba(0,0,0,0.35)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>
          Trending Topics
        </span>
        <div className="flex flex-wrap gap-1">
          {[
            { l: "Apple Pay",     hot: true  },
            { l: "CSV Export",    hot: false },
            { l: "Onboarding",    hot: false },
            { l: "Billing dates", hot: true  },
          ].map((t) => (
            <div
              key={t.l}
              className="rounded-full px-1.5 py-0.5"
              style={{
                background: t.hot ? "var(--adoniz-forest)" : "var(--adoniz-mist)",
                border: "1px solid " + (t.hot ? "transparent" : "var(--adoniz-distant-cloud)"),
                fontSize: "7px",
                color: t.hot ? "var(--adoniz-fluorescent)" : "var(--adoniz-forest)",
                fontWeight: t.hot ? 600 : 400,
              }}
            >
              {t.l}
            </div>
          ))}
        </div>
      </div>

      {/* Recent conversations */}
      <div className="flex-1 px-2 pt-2 overflow-hidden">
        <span style={{ fontSize: "7.5px", fontWeight: 600, color: "rgba(0,0,0,0.35)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>
          Recent
        </span>
        {convos.map((c, i) => (
          <div
            key={i}
            className="flex items-start gap-1.5 rounded-lg px-2 py-1.5 mb-1"
            style={{ background: "#fff", border: "1px solid var(--adoniz-distant-cloud)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: c.s === "pos" ? "#22C55E" : "#EF4444" }} />
            <div className="flex-1 min-w-0">
              <span style={{ fontSize: "7.5px", fontWeight: 600, color: "rgba(0,0,0,0.45)", display: "block" }}>{c.cat}</span>
              <p style={{ fontSize: "8px", color: "rgba(0,0,0,0.65)", lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom AI bar */}
      <div className="px-2 pb-3 pt-1 flex-shrink-0">
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "var(--adoniz-mist)", border: "1px solid var(--adoniz-distant-cloud)" }}>
          <span style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.32)", fontStyle: "italic", flex: 1 }}>Ask anything…</span>
          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--adoniz-pine)" }}>
            <span style={{ fontSize: "8px", color: "#fff", lineHeight: 1 }}>↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Titanium Laptop Frame ────────────────────────────────────────────────── */
function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full" style={{ maxWidth: "780px" }}>
      <div
        className="relative w-full"
        style={{
          aspectRatio: "16/10",
          background: "linear-gradient(160deg, #4a4a4c 0%, #2c2c2e 15%, #1a1a1c 40%, #0d0d0f 60%, #1a1a1c 80%, #3a3a3c 95%, #4a4a4c 100%)",
          borderRadius: "14px 14px 0 0",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}
      >
        <div className="absolute top-0 left-0 right-0" style={{ height: "2px", background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.18) 70%, transparent 100%)" }} />
        <div className="absolute top-0 bottom-0 left-0" style={{ width: "1.5px", background: "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 100%)" }} />
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: "#0a0a0a", boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }} />
        <div className="absolute overflow-hidden" style={{ inset: "9px 10px 13px 10px", borderRadius: "6px", background: "#F9FAFB" }}>
          {children}
        </div>
      </div>
      <div className="w-full" style={{ height: "3px", background: "linear-gradient(to bottom, #3a3a3c, #1c1c1e)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }} />
      <div
        className="relative w-full"
        style={{
          height: "22px",
          background: "linear-gradient(to bottom, #2d2d2f 0%, #1c1c1e 100%)",
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.4) 3px, rgba(0,0,0,0.4) 4px), repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(0,0,0,0.4) 5px, rgba(0,0,0,0.4) 6px)",
            backgroundSize: "6px 4px",
            backgroundPosition: "center 4px",
          }}
        />
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2" style={{ width: "60%", height: "4px", background: "rgba(0,0,0,0.18)", filter: "blur(10px)", borderRadius: "50%" }} />
    </div>
  );
}

/* ─── Titanium Phone Frame ─────────────────────────────────────────────────── */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width: "152px",
        aspectRatio: "9/19.5",
        background: "linear-gradient(160deg, #4a4a4c 0%, #2c2c2e 15%, #1a1a1c 40%, #0d0d0f 60%, #1a1a1c 80%, #3a3a3c 95%, #4a4a4c 100%)",
        borderRadius: "36px",
        boxShadow: "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
        overflow: "visible",
        padding: "5px",
      }}
    >
      <div className="absolute top-0 left-8 right-8 h-px" style={{ background: "rgba(255,255,255,0.2)", borderRadius: "50%" }} />
      <div className="absolute z-10" style={{ top: "16px", left: "50%", transform: "translateX(-50%)", width: "56px", height: "13px", background: "#000", borderRadius: "999px" }} />
      <div className="absolute overflow-hidden" style={{ inset: "5px", borderRadius: "32px", background: "#fff" }}>
        {children}
      </div>
      <div className="absolute" style={{ right: "-3px", top: "88px", width: "3.5px", height: "40px", background: "linear-gradient(to right, #2c2c2e, #4a4a4c)", borderRadius: "0 3px 3px 0" }} />
      <div className="absolute" style={{ left: "-3px", top: "68px", width: "3.5px", height: "26px", background: "linear-gradient(to left, #2c2c2e, #4a4a4c)", borderRadius: "3px 0 0 3px" }} />
      <div className="absolute" style={{ left: "-3px", top: "102px", width: "3.5px", height: "26px", background: "linear-gradient(to left, #2c2c2e, #4a4a4c)", borderRadius: "3px 0 0 3px" }} />
    </div>
  );
}

/* ─── Feature Marquee ─────────────────────────────────────────────────────── */
function FeatureMarquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="w-full overflow-hidden py-4" style={{ background: "var(--adoniz-device-green)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="marquee-track">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 mx-2"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: "var(--font-sans)",
              color: "rgba(255,255,255,0.55)",
              whiteSpace: "nowrap",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Section ─────────────────────────────────────────────────────────── */
export function DeviceShowcase() {
  return (
    <div style={{ background: "var(--adoniz-device-green)" }}>
      <section
        className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden"
        id="device-showcase"
        style={{ background: "var(--adoniz-device-green)" }}
      >
        {/* Glow */}
        <div
          className="device-glow absolute pointer-events-none"
          aria-hidden="true"
          style={{
            top: "58%", left: "50%",
            width: "700px", height: "500px",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.02) 60%, transparent 80%)",
            zIndex: 0,
          }}
        />

        {/* Quote — bold sans, typographic stacked treatment */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative z-10 text-center mb-14 max-w-[560px] mx-auto"
          style={{ lineHeight: 1.2 }}
        >
          <span style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)",
            color: "rgba(255,255,255,0.48)",
            letterSpacing: "-0.01em",
            display: "block",
            marginBottom: "2px",
          }}>
            2,000 conversations.
          </span>
          <span style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "clamp(1.4rem, 2.4vw, 1.85rem)",
            color: "rgba(255,255,255,0.82)",
            letterSpacing: "-0.03em",
            display: "block",
            marginBottom: "2px",
          }}>
            One question.
          </span>
          <span style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
            color: "var(--adoniz-fluorescent)",
            letterSpacing: "-0.04em",
            display: "block",
          }}>
            Instant clarity.
          </span>
        </motion.p>

        {/* Device composition */}
        <div className="relative z-10 flex items-end justify-center w-full" style={{ maxWidth: "860px" }}>
          {/* Laptop */}
          <motion.div
            initial={{ opacity: 0, x: -80, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: EASE }}
            className="w-full"
            style={{ maxWidth: "760px" }}
          >
            <LaptopFrame>
              <WhiteDashboard />
            </LaptopFrame>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, x: 80, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
            className="absolute"
            style={{ right: "-28px", bottom: "20px", zIndex: 10 }}
          >
            <PhoneFrame>
              <PhoneContent />
            </PhoneFrame>
          </motion.div>
        </div>
      </section>

      <FeatureMarquee />
    </div>
  );
}
