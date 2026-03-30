"use client";

import { useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function useSupabase() {
  return useMemo(
    () =>
      createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );
}
