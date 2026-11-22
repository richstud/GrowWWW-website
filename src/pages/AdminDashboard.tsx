import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, ExternalLink, FileText, Image as ImageIcon, Inbox, LogOut, Package, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { InboxPanel } from "@/components/admin/InboxPanel";
import { PortfolioPanel } from "@/components/admin/PortfolioPanel";
import { LogosPanel, ProductsPanel } from "@/components/admin/CatalogPanels";
import { ContentPanel } from "@/components/admin/ContentPanel";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import logo from "@/assets/growww-logo-full.webp";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "inbox", label: "Enquiries", icon: Inbox },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "products", label: "Products", icon: Package },
  { id: "logos", label: "Client logos", icon: ImageIcon },
  { id: "content", label: "Site content", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "ok" | "denied">("checking");
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState<TabId>(() => {
    const h = window.location.hash.slice(1) as TabId;
    return TABS.some((t) => t.id === h) ? h : "inbox";
  });

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate("/admin", { replace: true });
      setEmail(session.user.email || "");
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
      setState(data ? "ok" : "denied");
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/admin", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    window.history.replaceState(null, "", `#${tab}`);
  }, [tab]);

  const { data: newCount = 0 } = useQuery({
    queryKey: ["admin-new-count"],
    enabled: state === "ok",
    refetchInterval: 60_000,
    queryFn: async () => {
      const { count } = await supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new");
      return count || 0;
    },
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin", { replace: true });
  };

  if (state === "checking") {
    return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading…</div>;
  }
  if (state === "denied") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <Seo title="Admin | GrowWWW" noindex />
        <h1 className="font-display text-2xl font-bold text-gradient-gold">Access denied</h1>
        <p className="max-w-sm text-muted-foreground">{email} is signed in but isn't an admin.</p>
        <Button onClick={signOut} variant="outline">Sign out</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Admin Dashboard | GrowWWW" noindex />
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GrowWWW" className="h-9 w-9 object-contain" />
            <span className="hidden font-display font-bold sm:inline">GrowWWW Admin</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-primary sm:inline-flex">
              View site <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
        <nav className="mx-auto max-w-7xl overflow-x-auto px-4 [scrollbar-width:none]" aria-label="Admin sections">
          <div className="flex w-max gap-1 pb-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
                  tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {id === "inbox" && newCount > 0 && (
                  <span className={cn("rounded-full px-1.5 text-[10px] font-bold", tab === id ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground")}>{newCount}</span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:py-8">
        {tab === "inbox" && <InboxPanel />}
        {tab === "portfolio" && <PortfolioPanel />}
        {tab === "products" && <ProductsPanel />}
        {tab === "logos" && <LogosPanel />}
        {tab === "content" && <ContentPanel />}
        {tab === "settings" && <SettingsPanel email={email} />}
      </main>
    </div>
  );
}
