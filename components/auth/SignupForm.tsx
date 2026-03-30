"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "./AuthCard";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthCard title="Create your account" subtitle="Start understanding your customers today">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text" required value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          style={{
            height: "48px", borderRadius: "10px", padding: "0 16px",
            border: "1.5px solid var(--adoniz-distant-cloud)",
            fontSize: "14px", fontFamily: "var(--font-sans)", outline: "none",
          }}
        />
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          style={{
            height: "48px", borderRadius: "10px", padding: "0 16px",
            border: "1.5px solid var(--adoniz-distant-cloud)",
            fontSize: "14px", fontFamily: "var(--font-sans)", outline: "none",
          }}
        />
        <input
          type="password" required minLength={8} value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 characters)"
          style={{
            height: "48px", borderRadius: "10px", padding: "0 16px",
            border: "1.5px solid var(--adoniz-distant-cloud)",
            fontSize: "14px", fontFamily: "var(--font-sans)", outline: "none",
          }}
        />
        {error && <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "var(--font-sans)" }}>{error}</p>}
        <button
          type="submit" disabled={loading}
          style={{
            height: "48px", borderRadius: "10px",
            background: "var(--adoniz-fluorescent)", color: "var(--adoniz-pine)",
            fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "14px",
            border: "none", cursor: "pointer",
          }}
        >
          {loading ? "Creating account…" : "Get Started Free"}
        </button>
      </form>
      <p style={{ marginTop: "20px", textAlign: "center", fontSize: "13px", fontFamily: "var(--font-sans)", color: "rgba(0,0,0,0.5)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--adoniz-forest)", fontWeight: 600 }}>
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
