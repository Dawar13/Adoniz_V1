"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Upload, MessageSquare, Sparkles, Settings, X, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Dashboard",     href: "/dashboard",     icon: LayoutDashboard },
  { label: "Ingest Data",   href: "/ingest",         icon: Upload },
  { label: "Conversations", href: "/conversations",  icon: MessageSquare },
  { label: "Ask ADONIZ",    href: "/chat",           icon: Sparkles },
  { label: "Settings",      href: "/settings",       icon: Settings },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--app-sidebar-bg, #003D31)", padding: "20px" }}
    >
      {/* Logo + close button (mobile) */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "22px",
              color: "#F0FF3D",
              display: "block",
            }}
          >
            ADONIZ
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              color: "rgba(255,255,255,0.5)",
              display: "block",
              marginTop: "2px",
            }}
          >
            Voice of Customer Intelligence
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "rgba(255,255,255,0.6)" }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                height: "40px",
                padding: "0 12px",
                borderRadius: "8px",
                textDecoration: "none",
                background: active ? "rgba(240,255,61,0.12)" : "transparent",
                color: active ? "#F0FF3D" : "rgba(255,255,255,0.7)",
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                fontWeight: active ? 600 : 500,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px", marginTop: "16px" }}>
        <button
          onClick={handleSignOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            height: "40px",
            padding: "0 12px",
            borderRadius: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)"; }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export function AppSidebar({ mobileOpen, onMobileClose }: { mobileOpen?: boolean; onMobileClose?: () => void }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0"
        style={{ width: "256px", height: "100vh", position: "sticky", top: 0 }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={onMobileClose}
          />
          <div
            className="fixed inset-y-0 left-0 z-50 flex flex-col"
            style={{ width: "256px" }}
          >
            <SidebarContent onClose={onMobileClose} />
          </div>
        </>
      )}
    </>
  );
}
