"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-layout/AppSidebar";
import { AppTopBar } from "@/components/app-layout/AppTopBar";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AppTopBar onMenuToggle={() => setMobileOpen(true)} />
        <main style={{ flex: 1, overflowY: "auto", background: "#F8FAF9", padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
