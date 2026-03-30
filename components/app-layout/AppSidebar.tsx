"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Dashboard",      href: "/dashboard",     icon: "▦" },
  { label: "Conversations",  href: "/conversations",  icon: "☰" },
  { label: "Ingest Data",    href: "/ingest",         icon: "↑" },
  { label: "Ask Adoniz",     href: "/chat",           icon: "✦" },
  { label: "Settings",       href: "/settings",       icon: "⚙" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col flex-shrink-0 h-full"
      style={{ width: "220px", background: "var(--adoniz-pine)", borderRight: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Image src="/logos/adoniz-logo.svg" alt="Adoniz" width={22} height={21}
          style={{ filter: "invert(1) brightness(2)", opacity: 0.9 }} />
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "17px", color: "#fff", letterSpacing: "-0.02em" }}>
          Adoniz
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 p-3 pt-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
              style={{
                background: active ? "rgba(209,248,67,0.1)" : "transparent",
                borderLeft: `2px solid ${active ? "var(--adoniz-electric-lime)" : "transparent"}`,
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "13px", opacity: active ? 1 : 0.5 }}>{item.icon}</span>
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: active ? 600 : 400,
                color: active ? "#fff" : "rgba(255,255,255,0.55)",
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 pt-0">
        <div className="px-3 py-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(209,248,67,0.15)" }}>
              <span style={{ fontSize: "11px", color: "var(--adoniz-electric-lime)", fontWeight: 700 }}>A</span>
            </div>
            <div className="min-w-0">
              <p style={{ fontSize: "12px", color: "#fff", fontWeight: 600, fontFamily: "var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                My Workspace
              </p>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-sans)" }}>Free Plan</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
