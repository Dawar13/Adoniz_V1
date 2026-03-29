"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { INTEGRATIONS_INNER, INTEGRATIONS_OUTER } from "@/lib/constants";
import { useIsMobile } from "@/hooks/useIsMobile";

const EASE = [0.16, 1, 0.3, 1] as const;

function ellipsePos(angleDeg: number, rx: number, ry: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: Math.cos(rad) * rx, y: Math.sin(rad) * ry };
}

const INNER_STAGGER = [0, 4, 2, 5, 1, 3, 6];
const OUTER_STAGGER = [0, 4, 2, 5, 1, 3, 6];

function innerLineStart(rank: number, n: number) { return 0.08 + (rank / (n - 1)) * 0.28; }
function outerLineStart(rank: number, n: number) { return 0.50 + (rank / (n - 1)) * 0.26; }

function LogoNode({ name, file, x, y, progress, threshold, logoSize }: {
  name: string; file: string; x: number; y: number;
  progress: number; threshold: number; logoSize: number;
}) {
  const half = logoSize / 2;
  const pad = Math.round(logoSize * 0.173);
  const imgSize = Math.round(logoSize * 0.615);
  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1"
      style={{ left: "50%", top: "50%", x: x - half, y: y - half }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={progress > threshold ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-center rounded-xl" style={{
        width: `${logoSize}px`, height: `${logoSize}px`,
        background: "#FFFFFF", border: "1px solid var(--adoniz-distant-cloud)",
        boxShadow: "0 4px 16px rgba(0,61,49,0.08)", padding: `${pad}px`,
      }}>
        <Image src={`/logos/${file}`} alt={name} width={imgSize} height={imgSize}
          style={{ objectFit: "contain", width: "100%", height: "auto" }} />
      </div>
      <span style={{ fontSize: "9px", fontFamily: "var(--font-sans)", fontWeight: 500, color: "rgba(0,0,0,0.48)", whiteSpace: "nowrap" }}>
        {name}
      </span>
    </motion.div>
  );
}

function ConnectionLines({ innerPositions, outerPositions, ni, no, width, height, progress }: {
  innerPositions: { x: number; y: number }[];
  outerPositions: { x: number; y: number }[];
  ni: number; no: number; width: number; height: number; progress: number;
}) {
  const cx = width / 2, cy = height / 2;
  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}
      viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {innerPositions.map((pos, i) => {
        const rank = INNER_STAGGER[i] ?? i;
        const start = innerLineStart(rank, ni);
        const lineP = Math.min(1, Math.max(0, (progress - start) / 0.10));
        const len = Math.sqrt(pos.x ** 2 + pos.y ** 2);
        return <line key={`inner-${i}`} x1={cx} y1={cy} x2={cx + pos.x} y2={cy + pos.y}
          stroke="rgba(0,61,49,0.14)" strokeWidth="1"
          strokeDasharray={len} strokeDashoffset={len * (1 - lineP)} strokeLinecap="round" />;
      })}
      {outerPositions.map((pos, i) => {
        const rank = OUTER_STAGGER[i] ?? i;
        const start = outerLineStart(rank, no);
        const lineP = Math.min(1, Math.max(0, (progress - start) / 0.10));
        const len = Math.sqrt(pos.x ** 2 + pos.y ** 2);
        return <line key={`outer-${i}`} x1={cx} y1={cy} x2={cx + pos.x} y2={cy + pos.y}
          stroke="rgba(0,61,49,0.08)" strokeWidth="1"
          strokeDasharray={len} strokeDashoffset={len * (1 - lineP)} strokeLinecap="round" />;
      })}
    </svg>
  );
}

function OrbitalSystem({ progress, isMobile }: { progress: number; isMobile: boolean }) {
  const WIDTH    = isMobile ? 360  : 860;
  const HEIGHT   = isMobile ? 340  : 460;
  const INNER_RX = isMobile ? 90   : 210;
  const INNER_RY = isMobile ? 72   : 100;
  const OUTER_RX = isMobile ? 160  : 410;
  const OUTER_RY = isMobile ? 130  : 195;
  const LOGO_SIZE = isMobile ? 36  : 52;

  const ni = INTEGRATIONS_INNER.length, no = INTEGRATIONS_OUTER.length;
  const innerPositions = INTEGRATIONS_INNER.map((_, i) =>
    ellipsePos((i / ni) * 360, INNER_RX, INNER_RY));
  const outerPositions = INTEGRATIONS_OUTER.map((_, i) =>
    ellipsePos((i / no) * 360 + 360 / (no * 2), OUTER_RX, OUTER_RY));

  return (
    <div className="relative mx-auto" style={{ width: WIDTH, height: HEIGHT, maxWidth: "100%" }}>
      <ConnectionLines innerPositions={innerPositions} outerPositions={outerPositions}
        ni={ni} no={no} width={WIDTH} height={HEIGHT} progress={progress} />
      <div style={{ position: "absolute", inset: 0 }}>
        {INTEGRATIONS_INNER.map((logo, i) => {
          const rank = INNER_STAGGER[i] ?? i;
          const start = innerLineStart(rank, ni);
          return <LogoNode key={logo.name} name={logo.name} file={logo.file}
            x={innerPositions[i].x} y={innerPositions[i].y}
            progress={progress} threshold={start + 0.07} logoSize={LOGO_SIZE} />;
        })}
        {INTEGRATIONS_OUTER.map((logo, i) => {
          const rank = OUTER_STAGGER[i] ?? i;
          const start = outerLineStart(rank, no);
          return <LogoNode key={logo.name} name={logo.name} file={logo.file}
            x={outerPositions[i].x} y={outerPositions[i].y}
            progress={progress} threshold={start + 0.07} logoSize={LOGO_SIZE} />;
        })}
      </div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={progress > 0.02 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="flex items-center gap-2.5" style={{
            background: "var(--adoniz-pine)", borderRadius: "40px",
            padding: isMobile ? "10px 20px" : "12px 24px",
            boxShadow: "0 8px 32px rgba(0,61,49,0.25), 0 0 0 4px rgba(0,61,49,0.08)",
            whiteSpace: "nowrap",
          }}>
            <Image src="/logos/adoniz-logo.svg" alt="Adoniz"
              width={isMobile ? 16 : 20} height={isMobile ? 15 : 19}
              style={{ filter: "invert(1) brightness(2)", opacity: 0.9 }} />
            <span style={{
              fontFamily: "var(--font-sans)", fontWeight: 700,
              fontSize: isMobile ? "14px" : "16px",
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

/* ─── Unified sticky-scroll section (desktop + mobile) ───────────────────── */
function ConnectionsAnimation() {
  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const [liveProgress, setLiveProgress] = useState(0);
  const isMobile = useIsMobile();
  useMotionValueEvent(scrollYProgress, "change", setLiveProgress);

  return (
    <div ref={outerRef} id="integrations" style={{ height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div className="h-full flex flex-col overflow-hidden" style={{ background: "#FFFFFF", paddingTop: "56px", paddingBottom: "8px" }}>
          <div className="max-w-7xl mx-auto w-full px-4 flex flex-col flex-1">
            <div className="text-center mb-2 flex-shrink-0">
              <motion.div
                animate={liveProgress > 0.02 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="inline-flex items-center rounded-full px-4 py-1.5 mb-4"
                style={{
                  background: "var(--adoniz-mist)", border: "1px solid var(--adoniz-distant-cloud)",
                  fontSize: "11px", fontFamily: "var(--font-sans)", fontWeight: 600,
                  textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "var(--adoniz-forest)",
                }}
              >
                Integrations
              </motion.div>
              <motion.h2
                animate={liveProgress > 0.02 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
                style={{
                  fontFamily: "var(--font-serif)", fontWeight: 400,
                  fontSize: isMobile
                    ? "clamp(1.4rem, 5vw, 1.75rem)"
                    : "clamp(1.9rem, 3.5vw, 2.75rem)",
                  letterSpacing: "-0.01em", lineHeight: 1.1,
                  color: "var(--adoniz-forest)", marginBottom: "8px",
                  padding: isMobile ? "0 20px" : undefined,
                }}
              >
                Connects to{" "}
                <em style={{ fontStyle: "italic", color: "var(--adoniz-pine)" }}>everything</em>{" "}
                your team already uses
              </motion.h2>
              <motion.p
                animate={liveProgress > 0.04 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(0,0,0,0.42)", maxWidth: "380px", margin: "0 auto", lineHeight: 1.6 }}
              >
                Import from any source. More integrations added weekly.
              </motion.p>
            </div>
            <div className="flex items-center justify-center flex-1">
              <OrbitalSystem progress={liveProgress} isMobile={isMobile} />
            </div>
            <motion.p
              animate={liveProgress > 0.88 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center flex-shrink-0 mt-2"
              style={{ fontSize: "13px", fontFamily: "var(--font-sans)", color: "rgba(0,0,0,0.3)" }}
            >
              Don&apos;t see your tool?{" "}
              <a href="#" style={{ color: "var(--adoniz-forest)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                Upload CSV or use the API →
              </a>
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Entry point ─────────────────────────────────────────────────────────── */
export function ConnectionsSection() {
  return <ConnectionsAnimation />;
}
