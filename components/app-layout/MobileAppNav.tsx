"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard",     href: "/dashboard" },
  { label: "Conversations", href: "/conversations" },
  { label: "Ingest",        href: "/ingest" },
  { label: "Chat",          href: "/chat" },
  { label: "Settings",      href: "/settings" },
];

export function MobileAppNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        className="lg:hidden"
        onClick={() => setOpen(true)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}
        aria-label="Open menu"
      >
        <span style={{ fontSize: "18px" }}>☰</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "var(--adoniz-pine)" }}
        >
          <div className="flex items-center justify-between p-5">
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "#fff" }}>
              Adoniz
            </span>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer" }}>
              ✕
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-1 p-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "20px",
                  color: pathname.startsWith(item.href) ? "var(--adoniz-fluorescent)" : "#fff",
                  textDecoration: "none", padding: "10px 0",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
