import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// GrowWWW Supabase project. These are PUBLIC values (safe in the browser).
// Override with VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY in .env if you ever move projects.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://aryvikihjbpedoytwkxc.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeXZpa2loamJwZWRveXR3a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzMjU1NTQsImV4cCI6MjEwOTkwMTU1NH0.m6dBIE2wRwfAhbe9Hii-6CGIUn-YSAA8jSzrkZpn5io";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});

/** Public URL for a file in a public storage bucket, or the value unchanged if it's already a URL/path. */
export const publicFileUrl = (bucket: string, pathOrUrl?: string | null) => {
  if (!pathOrUrl) return "";
  if (/^(https?:|data:|blob:|\/)/.test(pathOrUrl)) return pathOrUrl;
  const clean = pathOrUrl.replace(new RegExp(`^${bucket}/`), "");
  return supabase.storage.from(bucket).getPublicUrl(clean).data.publicUrl;
};
