import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div
      className="w-full rounded-2xl p-8"
      style={{
        maxWidth: "420px",
        background: "#fff",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
      }}
    >
      <div className="mb-6">
        <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "26px", color: "var(--adoniz-pine)", marginBottom: "6px" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(0,0,0,0.5)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
