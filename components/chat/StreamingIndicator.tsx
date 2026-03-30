"use client";

import { motion } from "framer-motion";

export function StreamingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5"
        style={{ background: "#fff", border: "1px solid var(--adoniz-distant-cloud)" }}>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="rounded-full"
            style={{ width: "6px", height: "6px", background: "var(--adoniz-forest)" }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.55, delay: i * 0.1, repeat: Infinity }} />
        ))}
      </div>
    </div>
  );
}
