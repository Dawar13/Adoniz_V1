"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { UserMenu } from "./UserMenu";

const BREADCRUMBS: Record<string, string> = {
  "/dashboard":     "Dashboard",
  "/ingest":        "Ingest Data",
  "/conversations": "Conversations",
  "/chat":          "Ask ADONIZ",
  "/settings":      "Settings",
};

export function AppTopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname();
  const base = "/" + (pathname.split("/")[1] ?? "");
  const title = BREADCRUMBS[base] ?? "ADONIZ";

  return (
    <header
      className="flex items-center justify-between flex-shrink-0"
      style={{
        height: "56px",
        padding: "0 24px",
        background: "#fff",
        borderBottom: "1px solid #E5EAE6",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          className="lg:hidden"
          onClick={onMenuToggle}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#1A1A1A" }}
        >
          <Menu size={22} />
        </button>
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>
          {title}
        </span>
      </div>
      <UserMenu />
    </header>
  );
}
