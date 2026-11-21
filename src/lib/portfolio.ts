import { useQuery } from "@tanstack/react-query";
import { publicFileUrl, supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Project = Tables<"portfolio_projects">;

export const projectImage = (url?: string | null) => publicFileUrl("portfolio", url);

export function usePortfolio(opts: { featuredOnly?: boolean; limit?: number } = {}) {
  return useQuery({
    queryKey: ["portfolio", opts],
    queryFn: async () => {
      let q = supabase
        .from("portfolio_projects")
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("display_order")
        .order("created_at", { ascending: false });
      if (opts.featuredOnly) q = q.eq("is_featured", true);
      if (opts.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useProject(slug?: string) {
  return useQuery({
    queryKey: ["portfolio-project", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_projects").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return data as Project | null;
    },
  });
}
