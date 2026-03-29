"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const scrollY = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = scrollY > 80;

  return (
    <>
      {/* SVG displacement filter — makes content behind the capsule stretch/warp like liquid glass */}
      <svg style={{ display: "none", position: "fixed" }} aria-hidden="true">
        <defs>
          <filter
            id="navbar-glass"
            x="-10%" y="-30%"
            width="120%" height="160%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.0015 0.006"
              numOctaves="1"
              seed="17"
              result="turbulence"
            />
            <feComponentTransfer in="turbulence" result="mapped">
              <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
              <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
              <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
            </feComponentTransfer>
            <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
            <feSpecularLighting
              in="softMap"
              surfaceScale="5"
              specularConstant="1"
              specularExponent="100"
              lightingColor="white"
              result="specLight"
            >
              <fePointLight x="-200" y="-200" z="300" />
            </feSpecularLighting>
            <feComposite
              in="specLight"
              operator="arithmetic"
              k1="0" k2="1" k3="1" k4="0"
              result="litImage"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softMap"
              scale="90"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center"
        animate={{ paddingTop: scrolled ? "14px" : "0px" }}
        transition={{ duration: 0.55, ease: [0.32, 0, 0.1, 1] }}
        aria-label="Main navigation"
      >
        <motion.div
          className="relative overflow-hidden"
          animate={
            scrolled
              ? {
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
                }
              : {
                  width: "100%",
                  maxWidth: "100%",
                  borderRadius: "0px",
                  paddingLeft: "40px",
                  paddingRight: "40px",
                  paddingTop: "16px",
                  paddingBottom: "16px",
                  boxShadow: "none",
                  borderColor: "rgba(255,255,255,0.0)",
                }
          }
          transition={{ duration: 0.55, ease: [0.32, 0, 0.1, 1] }}
          style={{ borderWidth: "1px", borderStyle: "solid", borderColor: "transparent" }}
        >
          {/* Layer 1: Distortion — blurs + warps the content behind (the liquid glass core) */}
          <motion.div
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0, 0.1, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              backdropFilter: "blur(3px)",
              filter: "url(#navbar-glass)",
              isolation: "isolate",
              zIndex: 0,
            }}
          />

          {/* Layer 2: White tint — brightness of glass */}
          <motion.div
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0, 0.1, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              background: "rgba(255,255,255,0.55)",
              zIndex: 1,
            }}
          />

          {/* Layer 3: Inner edge sheen — top-left highlight that makes it feel like a glass block */}
          <motion.div
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0, 0.1, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              boxShadow:
                "inset 2px 2px 1px rgba(255,255,255,0.65), inset -1px -1px 1px rgba(255,255,255,0.45)",
              zIndex: 2,
            }}
          />

          {/* Navbar content — above all glass layers */}
          <div
            className="relative flex items-center justify-between w-full"
            style={{ zIndex: 30 }}
          >
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <Image
                src="/logos/adoniz-logo.svg"
                alt="Adoniz"
                width={26}
                height={25}
                style={{ color: "var(--adoniz-forest)" }}
                className="text-adoniz-forest"
              />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "18px",
                  letterSpacing: "-0.02em",
                  color: "var(--adoniz-forest)",
                }}
              >
                Adoniz
              </span>
            </a>

            {/* Center links */}
            <ul className="hidden lg:flex items-center gap-7 list-none m-0 p-0">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="nav-link"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "rgba(0,0,0,0.65)",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(0,0,0,1)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(0,0,0,0.65)")
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "rgba(0,0,0,0.65)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 12px",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "rgba(0,0,0,1)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "rgba(0,0,0,0.65)")
                }
              >
                Log In
              </button>
              <button
                className="font-bold transition-all duration-250"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 700,
                  background: "var(--adoniz-fluorescent)",
                  color: "var(--adoniz-pine)",
                  padding: "10px 22px",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "10px",
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
              className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span
                className="block w-5 h-0.5 rounded-full"
                style={{ background: "var(--adoniz-pine)" }}
              />
              <span
                className="block w-4 h-0.5 rounded-full"
                style={{ background: "var(--adoniz-pine)" }}
              />
              <span
                className="block w-5 h-0.5 rounded-full"
                style={{ background: "var(--adoniz-pine)" }}
              />
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ background: "var(--adoniz-pine)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between p-6">
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "#fff",
                }}
              >
                Adoniz
              </span>
              <button
                className="text-white w-9 h-9 flex items-center justify-center"
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-8 gap-5">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 400,
                    fontSize: "clamp(2rem, 8vw, 3rem)",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <div className="p-8">
              <button
                className="w-full font-bold py-4"
                style={{
                  background: "var(--adoniz-fluorescent)",
                  color: "var(--adoniz-pine)",
                  fontSize: "16px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  borderRadius: "10px",
                }}
              >
                Get Early Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
