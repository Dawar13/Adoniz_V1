"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useIsMobile } from "@/hooks/useIsMobile";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const scrollY = useScrollPosition();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = scrollY > 80;

  /* ── Desktop: liquid glass capsule morph ────────────────────────────────── */
  const desktopScrolled = {
    width: "auto",
    minWidth: "800px",
    maxWidth: "860px",
    borderRadius: "18px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "10px",
    paddingBottom: "10px",
    boxShadow: "0 8px 40px rgba(0,61,49,0.10)",
    borderColor: "rgba(255,255,255,0.68)",
  };
  const desktopUnscrolled = {
    width: "100%",
    maxWidth: "100%",
    borderRadius: "0px",
    paddingLeft: "40px",
    paddingRight: "40px",
    paddingTop: "16px",
    paddingBottom: "16px",
    boxShadow: "none",
    borderColor: "rgba(255,255,255,0.0)",
  };

  /* ── Mobile: full-width bar, no capsule morph ───────────────────────────── */
  const mobileScrolled = {
    width: "100%",
    minWidth: "unset",
    maxWidth: "100%",
    borderRadius: "0px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "12px",
    paddingBottom: "12px",
    boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
    borderColor: "rgba(0,0,0,0.06)",
  };
  const mobileUnscrolled = {
    width: "100%",
    minWidth: "unset",
    maxWidth: "100%",
    borderRadius: "0px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "14px",
    paddingBottom: "14px",
    boxShadow: "none",
    borderColor: "rgba(255,255,255,0.0)",
  };

  const innerAnimate = isMobile
    ? (scrolled ? mobileScrolled : mobileUnscrolled)
    : (scrolled ? desktopScrolled : desktopUnscrolled);

  return (
    <>
      {/* SVG displacement filter — desktop liquid glass only */}
      {!isMobile && (
        <svg style={{ display: "none", position: "fixed" }} aria-hidden="true">
          <defs>
            <filter id="navbar-glass" x="-10%" y="-30%" width="120%" height="160%" filterUnits="objectBoundingBox">
              <feTurbulence type="fractalNoise" baseFrequency="0.0015 0.006" numOctaves="1" seed="17" result="turbulence" />
              <feComponentTransfer in="turbulence" result="mapped">
                <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
                <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
                <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
              </feComponentTransfer>
              <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
              <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
                <fePointLight x="-200" y="-200" z="300" />
              </feSpecularLighting>
              <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
              <feDisplacementMap in="SourceGraphic" in2="softMap" scale="90" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
      )}

      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center"
        animate={{ paddingTop: scrolled && !isMobile ? "14px" : "0px" }}
        transition={{ duration: 0.55, ease: [0.32, 0, 0.1, 1] }}
        aria-label="Main navigation"
      >
        <motion.div
          className="navbar-inner relative overflow-hidden"
          animate={innerAnimate}
          transition={{ duration: 0.55, ease: [0.32, 0, 0.1, 1] }}
          style={{ borderWidth: "1px", borderStyle: "solid", borderColor: "transparent" }}
        >
          {/* Layer 1: Distortion (desktop) / Blur (mobile) */}
          {!isMobile ? (
            <motion.div
              animate={{ opacity: scrolled ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.32, 0, 0.1, 1] }}
              style={{
                position: "absolute", inset: 0, borderRadius: "inherit",
                backdropFilter: "blur(3px)", filter: "url(#navbar-glass)",
                isolation: "isolate", zIndex: 0,
              }}
            />
          ) : (
            <motion.div
              animate={{ opacity: scrolled ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.32, 0, 0.1, 1] }}
              style={{
                position: "absolute", inset: 0, borderRadius: "inherit",
                backdropFilter: "blur(20px) saturate(1.8)",
                zIndex: 0,
              }}
            />
          )}

          {/* Layer 2: White tint */}
          <motion.div
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0, 0.1, 1] }}
            style={{
              position: "absolute", inset: 0, borderRadius: "inherit",
              background: "rgba(255,255,255,0.52)",
              zIndex: 1,
            }}
          />

          {/* Layer 3: Inner sheen (desktop only) */}
          {!isMobile && (
            <motion.div
              animate={{ opacity: scrolled ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.32, 0, 0.1, 1] }}
              style={{
                position: "absolute", inset: 0, borderRadius: "inherit",
                boxShadow: "inset 2px 2px 1px rgba(255,255,255,0.65), inset -1px -1px 1px rgba(255,255,255,0.45)",
                zIndex: 2,
              }}
            />
          )}

          {/* Navbar content */}
          <div className="relative flex items-center justify-between w-full" style={{ zIndex: 30 }}>
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image src="/logos/adoniz-logo.svg" alt="Adoniz" width={26} height={25}
                style={{ color: "var(--adoniz-forest)" }} />
              <span style={{
                fontFamily: "var(--font-sans)", fontWeight: 700,
                fontSize: isMobile ? "17px" : "18px",
                letterSpacing: "-0.02em", color: "var(--adoniz-forest)",
              }}>
                Adoniz
              </span>
            </a>

            {/* Desktop center links */}
            <ul className="hidden lg:flex items-center gap-7 list-none m-0 p-0">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="nav-link" style={{
                    fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 500,
                    color: "rgba(0,0,0,0.65)", transition: "color 0.2s",
                  }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(0,0,0,1)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(0,0,0,0.65)")}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button style={{
                fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500,
                color: "rgba(0,0,0,0.65)", background: "none", border: "none",
                cursor: "pointer", padding: "8px 12px",
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(0,0,0,1)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(0,0,0,0.65)")}
              >
                Log In
              </button>
              <button className="font-bold" style={{
                fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700,
                background: "var(--adoniz-fluorescent)", color: "var(--adoniz-pine)",
                padding: "10px 22px", border: "none", cursor: "pointer", borderRadius: "10px",
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "var(--adoniz-yellow-ace)";
                  el.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "var(--adoniz-fluorescent)";
                  el.style.transform = "translateY(0)";
                }}
              >
                Get Early Access
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
            >
              <span className="block w-5 h-0.5 rounded-full" style={{ background: "var(--adoniz-pine)" }} />
              <span className="block w-4 h-0.5 rounded-full" style={{ background: "var(--adoniz-pine)" }} />
              <span className="block w-5 h-0.5 rounded-full" style={{ background: "var(--adoniz-pine)" }} />
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile overlay — slides in from right */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ background: "var(--adoniz-pine)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between" style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "20px", color: "#fff" }}>
                Adoniz
              </span>
              <button
                className="flex items-center justify-center w-11 h-11"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                style={{ background: "rgba(255,255,255,0.08)", borderRadius: "10px", border: "none", cursor: "pointer" }}
              >
                <svg viewBox="0 0 24 24" fill="none" style={{ width: "18px", height: "18px" }}>
                  <path d="M6 6l12 12M6 18L18 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-center" style={{ padding: "0 32px", gap: "4px" }}>
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "clamp(1.75rem, 7vw, 2.25rem)",
                    color: "#fff",
                    textDecoration: "none",
                    lineHeight: 1.35,
                    display: "block",
                    padding: "8px 0",
                    opacity: 0,
                  }}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {/* CTA buttons at bottom */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <button style={{
                background: "var(--adoniz-fluorescent)",
                color: "var(--adoniz-pine)",
                fontSize: "15px", fontWeight: 700,
                fontFamily: "var(--font-sans)",
                height: "52px", border: "none", cursor: "pointer",
                borderRadius: "12px", width: "100%",
              }}>
                Get Started
              </button>
              <button style={{
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                fontSize: "15px", fontWeight: 600,
                fontFamily: "var(--font-sans)",
                height: "52px", border: "1px solid rgba(255,255,255,0.15)",
                cursor: "pointer", borderRadius: "12px", width: "100%",
              }}>
                Book a demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
