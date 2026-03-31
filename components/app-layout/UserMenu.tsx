"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
        style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "var(--adoniz-mist)", border: "1px solid var(--adoniz-distant-cloud)" }}
        >
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--adoniz-pine)" }}>A</span>
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-10 z-20 rounded-xl overflow-hidden"
            style={{
              background: "#fff",
              border: "1px solid var(--adoniz-distant-cloud)",
              boxShadow: "0 8px 32px rgba(0,61,49,0.12)",
              minWidth: "160px",
            }}
          >
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3"
              style={{
                fontFamily: "var(--font-sans)", fontSize: "13px",
                color: "rgba(0,0,0,0.65)", background: "none", border: "none",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
