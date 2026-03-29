"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { INTEGRATIONS_INNER, INTEGRATIONS_OUTER } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Ellipse position (wider x, shorter y) ──────────────────────────────── */
function ellipsePos(angleDeg: number, rx: number, ry: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: Math.cos(rad) * rx, y: Math.sin(rad) * ry };
}

const INNER_STAGGER = [0, 4, 2, 5, 1, 3, 6];
const OUTER_STAGGER = [0, 4, 2, 5, 1, 3, 6];

/* ─── Timing ──────────────────────────────────────────────────────────────── */
function innerLineStart(rank: number, n: number) {
  return 0.08 + (rank / (n - 1)) * 0.28;
}
function outerLineStart(rank: number, n: number) {
  return 0.50 + (rank / (n - 1)) * 0.26;
}

/* ─── Logo node (52px) ────────────────────────────────────────────────────── */
const LOGO_SIZE = 52;
const LOGO_HALF = LOGO_SIZE / 2;

function LogoNode({
  name, file, x, y, progress, threshold,
}: {
  name: string; file: string; x: number; y: number;
  progress: number; threshold: number;
}) {
  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1"
      style={{ left: "50%", top: "50%", x: x - LOGO_HALF, y: y - LOGO_HALF }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={progress > threshold ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div
        className="flex items-center justify-center rounded-xl"
        style={{
          width: `${LOGO_SIZE}px`, height: `${LOGO_SIZE}px`,
          background: "#FFFFFF",
          border: "1px solid var(--adoniz-distant-cloud)",
          boxShadow: "0 4px 16px rgba(0,61,49,0.08)",
          padding: "9px",
        }}
      >
        <Image
          src={`/logos/${file}`} alt={name} width={32} height={32}
          style={{ objectFit: "contain", width: "100%", height: "auto" }}
        />
      </div>
      <span style={{
        fontSize: "9px", fontFamily: "var(--font-sans)", fontWeight: 500,
        color: "rgba(0,0,0,0.48)", whiteSpace: "nowrap",
      }}>
        {name}
      </span>
    </motion.div>
  );
}

/* ─── SVG connection lines (uses precomputed ellipse positions) ───────────── */
function ConnectionLines({
  innerPositions, outerPositions, ni, no, width, height, progress,
}: {
  innerPositions: { x: number; y: number }[];
  outerPositions: { x: number; y: number }[];
  ni: number; no: number;
  width: number; height: number;
  progress: number;
}) {
  const cx = width / 2;
  const cy = height / 2;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {innerPositions.map((pos, i) => {
        const x2 = cx + pos.x;
        const y2 = cy + pos.y;
        const rank = INNER_STAGGER[i] ?? i;
        const start = innerLineStart(rank, ni);
        const lineP = Math.min(1, Math.max(0, (progress - start) / 0.10));
        const len = Math.sqrt(pos.x ** 2 + pos.y ** 2);
        return (
          <line key={`inner-${i}`} x1={cx} y1={cy} x2={x2} y2={y2}
            stroke="rgba(0,61,49,0.14)" strokeWidth="1"
            strokeDasharray={len} strokeDashoffset={len * (1 - lineP)}
            strokeLinecap="round" />
        );
      })}
      {outerPositions.map((pos, i) => {
        const x2 = cx + pos.x;
        const y2 = cy + pos.y;
        const rank = OUTER_STAGGER[i] ?? i;
        const start = outerLineStart(rank, no);
        const lineP = Math.min(1, Math.max(0, (progress - start) / 0.10));
        const len = Math.sqrt(pos.x ** 2 + pos.y ** 2);
        return (
          <line key={`outer-${i}`} x1={cx} y1={cy} x2={x2} y2={y2}
            stroke="rgba(0,61,49,0.08)" strokeWidth="1"
            strokeDasharray={len} strokeDashoffset={len * (1 - lineP)}
            strokeLinecap="round" />
        );
      })}
    </svg>
  );
}

/* ─── Orbital system ─────────────────────────────────────────────────────── */
function OrbitalSystem({ progress }: { progress: number }) {
  /* Elliptical layout: x-radius > y-radius = wide spread left/right */
  const WIDTH    = 860;
  const HEIGHT   = 460;
  const INNER_RX = 210;  // horizontal radius inner ring
  const INNER_RY = 100;  // vertical   radius inner ring
  const OUTER_RX = 410;  // horizontal radius outer ring
  const OUTER_RY = 195;  // vertical   radius outer ring

  const ni = INTEGRATIONS_INNER.length;
  const no = INTEGRATIONS_OUTER.length;

  const innerPositions = INTEGRATIONS_INNER.map((_, i) =>
    ellipsePos((i / ni) * 360, INNER_RX, INNER_RY)
  );
  const outerPositions = INTEGRATIONS_OUTER.map((_, i) =>
    ellipsePos((i / no) * 360 + 360 / (no * 2), OUTER_RX, OUTER_RY)
  );

  return (
    <div className="relative mx-auto" style={{ width: WIDTH, height: HEIGHT, maxWidth: "100%" }}>
      <ConnectionLines
        innerPositions={innerPositions}
        outerPositions={outerPositions}
        ni={ni} no={no}
        width={WIDTH} height={HEIGHT}
        progress={progress}
      />

      <div style={{ position: "absolute", inset: 0 }}>
        {INTEGRATIONS_INNER.map((logo, i) => {
          const rank = INNER_STAGGER[i] ?? i;
          const start = innerLineStart(rank, ni);
          return (
            <LogoNode key={logo.name} name={logo.name} file={logo.file}
              x={innerPositions[i].x} y={innerPositions[i].y}
              progress={progress} threshold={start + 0.07} />
          );
        })}
        {INTEGRATIONS_OUTER.map((logo, i) => {
          const rank = OUTER_STAGGER[i] ?? i;
          const start = outerLineStart(rank, no);
          return (
            <LogoNode key={logo.name} name={logo.name} file={logo.file}
              x={outerPositions[i].x} y={outerPositions[i].y}
              progress={progress} threshold={start + 0.07} />
          );
        })}
      </div>

      {/* Center Adoniz capsule */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", zIndex: 10,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={progress > 0.02 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div
            className="flex items-center gap-2.5 px-6 py-3"
            style={{
              background: "var(--adoniz-pine)",
              borderRadius: "40px",
              boxShadow: "0 8px 32px rgba(0,61,49,0.25), 0 0 0 4px rgba(0,61,49,0.08)",
              whiteSpace: "nowrap",
            }}
          >
            <Image src="/logos/adoniz-logo.svg" alt="Adoniz" width={20} height={19}
              style={{ filter: "invert(1) brightness(2)", opacity: 0.9 }} />
            <span style={{
              fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "16px",
              color: "var(--adoniz-fluorescent)", letterSpacing: "-0.02em",
            }}>
              Adoniz
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */
export function ConnectionsSection() {
  const outerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const [liveProgress, setLiveProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setLiveProgress);

  const sectionContent = (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "#FFFFFF", paddingTop: "56px", paddingBottom: "8px" }}
    >
      <div className="max-w-7xl mx-auto w-full px-4 flex flex-col flex-1">
        {/* Headline */}
        <div className="text-center mb-2 flex-shrink-0">
          <motion.div
            animate={liveProgress > 0.02 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center rounded-full px-4 py-1.5 mb-4"
            style={{
              background: "var(--adoniz-mist)",
              border: "1px solid var(--adoniz-distant-cloud)",
              fontSize: "11px", fontFamily: "var(--font-sans)", fontWeight: 600,
              textTransform: "uppercase" as const, letterSpacing: "0.1em",
              color: "var(--adoniz-forest)",
            }}
          >
            Integrations
          </motion.div>
          <motion.h2
            animate={liveProgress > 0.02 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
            style={{
              fontFamily: "var(--font-serif)", fontWeight: 400,
              fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)",
              letterSpacing: "-0.01em", lineHeight: 1.1,
              color: "var(--adoniz-forest)", marginBottom: "8px",
            }}
          >
            Connects to{" "}
            <em style={{ fontStyle: "italic", color: "var(--adoniz-pine)" }}>everything</em>{" "}
            your team already uses
          </motion.h2>
          <motion.p
            animate={liveProgress > 0.04 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              fontFamily: "var(--font-sans)", fontSize: "14px",
              color: "rgba(0,0,0,0.42)", maxWidth: "380px",
              margin: "0 auto", lineHeight: 1.6,
            }}
          >
            Import from any source. More integrations added weekly.
          </motion.p>
        </div>

        {/* Orbital */}
        <div className="flex items-center justify-center flex-1">
          <OrbitalSystem progress={liveProgress} />
        </div>

        {/* Footer note */}
        <motion.p
          animate={liveProgress > 0.88 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center flex-shrink-0 mt-2"
          style={{ fontSize: "13px", fontFamily: "var(--font-sans)", color: "rgba(0,0,0,0.3)" }}
        >
          Don&apos;t see your tool?{" "}
          <a href="#" style={{
            color: "var(--adoniz-forest)", textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}>
            Upload CSV or use the API →
          </a>
        </motion.p>
      </div>
    </div>
  );

  return (
    <div ref={outerRef} id="integrations" style={{ height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {sectionContent}
      </div>
    </div>
  );
}
