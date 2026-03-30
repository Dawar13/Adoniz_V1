"use client";

import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";

const BREADCRUMBS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/conversations": "Conversations",
  "/ingest": "Ingest Data",
  "/chat": "Ask Adoniz",
  "/settings": "Settings",
};

export function AppTopBar() {
  const pathname = usePathname();
  const base = "/" + (pathname.split("/")[1] ?? "");
  const title = BREADCRUMBS[base] ?? "Adoniz";

  return (
    <header
      className="flex items-center justify-between flex-shrink-0 px-6 lg:px-8"
      style={{
        height: "56px",
        background: "#fff",
        borderBottom: "1px solid var(--adoniz-distant-cloud)",
      }}
    >
      <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "15px", color: "var(--adoniz-pine)" }}>
        {title}
      </h2>
      <UserMenu />
    </header>
  );
}
