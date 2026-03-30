"use client";

import useSWR from "swr";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

function getClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR("auth/user", async () => {
    const supabase = getClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return { user, profile };
  });

  return {
    user: data?.user ?? null,
    profile: data?.profile ?? null,
    isLoading,
    error,
    refresh: mutate,
  };
}
