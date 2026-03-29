"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section
      id="cta"
      className="relative py-28 lg:py-36 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, var(--adoniz-pine) 0%, var(--adoniz-teal-spill) 100%)",
      }}
    >
      {/* Glow */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(209,248,67,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(242,247,247,1) 0, rgba(242,247,247,1) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(242,247,247,1) 0, rgba(242,247,247,1) 1px, transparent 1px, transparent 60px)",
          opacity: 0.025,
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
          style={{
            background: "rgba(209,248,67,0.1)",
            border: "1px solid rgba(209,248,67,0.18)",
            fontSize: "11px",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            color: "var(--adoniz-electric-lime)",
          }}
        >
          Early Access
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
            color: "var(--adoniz-snow)",
            marginBottom: "16px",
          }}
        >
          Your customers are talking.{" "}
          <span style={{ color: "var(--adoniz-fluorescent)" }}>Start listening.</span>
        </motion.h2>

        {/* Sub-text */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(1rem, 1.5vw, 1.1rem)",
            color: "rgba(242,247,247,0.52)",
            lineHeight: 1.65,
            maxWidth: "440px",
            margin: "0 auto 36px",
          }}
        >
          Join 200+ product teams using Adoniz to hear what their customers actually need.
        </motion.p>

        {/* Email form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
          className="cta-form flex flex-col sm:flex-row gap-3 justify-center max-w-[460px] mx-auto"
        >
          {submitted ? (
            <div
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4"
              style={{
                borderRadius: "10px",
                background: "rgba(209,248,67,0.12)",
                border: "1px solid rgba(209,248,67,0.2)",
                color: "var(--adoniz-electric-lime)",
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              ✓ You&apos;re on the list!
            </div>
          ) : (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="you@company.com"
                required
                className="flex-1"
                style={{
                  height: "52px",
                  borderRadius: "10px",
                  padding: "0 24px",
                  fontSize: "14px",
                  fontFamily: "var(--font-sans)",
                  background: "rgba(255,255,255,0.09)",
                  border: focused ? "1.5px solid rgba(209,248,67,0.5)" : "1.5px solid rgba(255,255,255,0.14)",
                  color: "#fff",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              <button
                type="submit"
                className="flex-shrink-0 font-bold transition-all duration-250"
                style={{
                  background: "var(--adoniz-fluorescent)",
                  color: "var(--adoniz-pine)",
                  padding: "0 30px",
                  height: "52px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap" as const,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "var(--adoniz-yellow-ace)";
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = "0 8px 32px rgba(240,255,61,0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "var(--adoniz-fluorescent)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                Get Early Access
              </button>
            </>
          )}
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4"
          style={{ fontSize: "12px", fontFamily: "var(--font-sans)", color: "rgba(242,247,247,0.3)" }}
        >
          Free during early access · No credit card required
        </motion.p>
      </div>
    </section>
  );
}
