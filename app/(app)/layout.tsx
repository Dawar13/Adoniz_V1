import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-layout/AppSidebar";
import { AppTopBar } from "@/components/app-layout/AppTopBar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--adoniz-snow)" }}>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppTopBar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
