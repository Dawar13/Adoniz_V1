"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GradientBlob } from "@/components/ui/GradientBlob";
import { HERO_SUBHEADLINE } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

const AVATAR_SRCS = [
  "/images/people/avatar-1.png",
  "/images/people/avatar-2.png",
  "/images/people/avatar-3.png",
  "/images/people/avatar-4.png",
  "/images/people/avatar-5.png",
];

function AvatarStack() {
  return (
    /* trust-row class handled by globals.css for mobile stacking */
    <div className="trust-row flex items-center">
      <div className="flex flex-shrink-0" style={{ direction: "ltr" }}>
        {AVATAR_SRCS.map((src, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-full select-none flex-shrink-0"
            style={{
              width: "36px", height: "36px",
              border: "2.5px solid #FFFFFF",
              marginLeft: i > 0 ? "-10px" : "0",
              zIndex: AVATAR_SRCS.length - i,
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
              background: "#E0EDE8",
            }}
          >
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>
      <span
        className="trust-text"
        style={{
          fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px",
          color: "rgba(0,0,0,0.72)", lineHeight: 1.3, marginLeft: "12px",
        }}
      >
        Trusted by 200+ early SaaS teams
      </span>
    </div>
  );
}

function BookDemoButton() {
  return (
    <button className="btn-book-demo" style={{ fontFamily: "var(--font-sans)" }}>
      <span className="icon-block">
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4"    cy="10" r="1.5" fill="currentColor"/>
          <circle cx="8"    cy="10" r="1.5" fill="currentColor"/>
          <circle cx="12"   cy="10" r="1.5" fill="currentColor"/>
          <circle cx="15"   cy="7"  r="1.5" fill="currentColor"/>
          <circle cx="15"   cy="13" r="1.5" fill="currentColor"/>
          <circle cx="17.5" cy="10" r="1.5" fill="currentColor"/>
        </svg>
      </span>
      <span className="label">Book a demo</span>
    </button>
  );
}

function SearchBar() {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        height: "48px", borderRadius: "12px",
        background: "var(--adoniz-white, #FFFFFF)",
        border: focused ? "1.5px solid var(--adoniz-electric-lime)" : "1.5px solid var(--adoniz-distant-cloud, #D6E4DF)",
        boxShadow: focused ? "0 2px 16px rgba(0,61,49,0.05), 0 0 0 3px rgba(209,248,67,0.12)" : "0 2px 16px rgba(0,61,49,0.05)",
        padding: "0 6px 0 12px",
        display: "flex", alignItems: "center", gap: "8px",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      <span style={{ color: "var(--adoniz-electric-lime)", fontSize: "14px", flexShrink: 0, lineHeight: 1 }}>✦</span>
      <input
        type="text"
        placeholder="What are customers saying about checkout?"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="hero-search-input"
        style={{
          flex: 1, minWidth: 0, background: "none", border: "none", outline: "none",
          fontSize: "13px", fontFamily: "var(--font-sans)", fontWeight: 500,
          color: "rgba(0,0,0,0.78)",
        }}
      />
      <button
        style={{
          background: "var(--adoniz-pine)", color: "white", border: "none",
          borderRadius: "8px", padding: "8px 14px", fontSize: "13px",
          fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer",
          flexShrink: 0, height: "36px", display: "flex", alignItems: "center",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--adoniz-forest)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--adoniz-pine)"; }}
      >
        Analyze
      </button>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 68%, #F5FAF8 76%, #E6F2EE 83%, #C2DDD3 88%, #7FBCAB 92%, #3D9382 96%, #013540 100%)",
      }}
    >
      <GradientBlob />

      {/* Geometric grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
        backgroundImage: "repeating-linear-gradient(0deg, var(--adoniz-forest) 0, var(--adoniz-forest) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(90deg, var(--adoniz-forest) 0, var(--adoniz-forest) 1px, transparent 1px, transparent 64px)",
        opacity: 0.025,
      }} />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center text-center w-full"
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "0 24px",
          paddingTop: "88px",
        }}
      >
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.3, ease: EASE }}
          style={{
            fontSize: "clamp(1.75rem, 7vw, 3.25rem)",
            lineHeight: 1.1, letterSpacing: "-0.022em",
            color: "#000000", fontFamily: "var(--font-sans)", fontWeight: 700,
            marginBottom: "14px",
          }}
        >
          Discover what your customers{" "}
          <br className="hidden sm:block" />
          <em style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontStyle: "italic", color: "#000000" }}>
            actually
          </em>{" "}
          want
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.45, ease: EASE }}
          style={{
            fontFamily: "var(--font-sans)", fontWeight: 400,
            fontSize: "clamp(0.9375rem, 1.3vw, 1rem)",
            lineHeight: 1.62, color: "rgba(0,0,0,0.50)",
            maxWidth: "480px", marginBottom: "20px",
          }}
        >
          {HERO_SUBHEADLINE}
        </motion.p>

        {/* CTA buttons — hero-cta-row stacks on mobile via CSS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.6, ease: EASE }}
          className="hero-cta-row flex items-center gap-3 flex-wrap justify-center"
          style={{ marginBottom: "20px", width: "100%" }}
        >
          <button
            className="font-bold"
            style={{
              fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "14px",
              background: "var(--adoniz-fluorescent)", color: "var(--adoniz-pine)",
              padding: "11px 24px", border: "none", cursor: "pointer", borderRadius: "10px",
              minHeight: "44px",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "var(--adoniz-yellow-ace)";
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "0 8px 24px rgba(240,255,61,0.35)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "var(--adoniz-fluorescent)";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            Get Started
          </button>
          <BookDemoButton />
        </motion.div>

        {/* AI Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.72, ease: EASE }}
          className="w-full"
          style={{ maxWidth: "520px", marginBottom: "16px" }}
        >
          <SearchBar />
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.85, ease: EASE }}
        >
          <AvatarStack />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        <motion.div
          className="w-px h-9 origin-top"
          style={{ background: "rgba(0,61,49,0.18)" }}
          animate={{ scaleY: [1, 0.25, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
