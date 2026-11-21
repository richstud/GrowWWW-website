import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MessageCircle, Phone, Search, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDelete, Panel, inputCls } from "./shared";
import { cn } from "@/lib/utils";

type Enquiry = Tables<"contact_submissions">;
const STATUSES = ["new", "contacted", "proposal", "won", "lost", "spam"] as const;
const tone: Record<string, string> = {
  new: "bg-primary/20 text-primary",
  contacted: "bg-sky-500/15 text-sky-300",
  proposal: "bg-violet-500/15 text-violet-300",
  won: "bg-emerald-500/15 text-emerald-300",
  lost: "bg-muted text-muted-foreground",
  spam: "bg-destructive/15 text-red-300",
};

export function InboxPanel() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("open");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data as Enquiry[];
    },
  });

  // Live updates when a new enquiry arrives
  useEffect(() => {
    const ch = supabase
      .channel("admin-enquiries")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_submissions" }, () => qc.invalidateQueries({ queryKey: ["admin-enquiries"] }))
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { open: 0 };
    data.forEach((e) => {
      c[e.status] = (c[e.status] || 0) + 1;
      if (!["won", "lost", "spam"].includes(e.status)) c.open++;
    });
    return c;
  }, [data]);

  const shown = data.filter((e) => {
    if (filter === "open" ? ["won", "lost", "spam"].includes(e.status) : filter !== "all" && e.status !== filter) return false;
    if (!q) return true;
    const hay = [e.name, e.email, e.phone, e.company, e.service, e.message].join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const update = async (id: string, patch: Partial<Enquiry>) => {
    const { error } = await supabase.from("contact_submissions").update(patch).eq("id", id);
    if (error) return toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
    qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) return toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
    toast({ title: "Enquiry deleted" });
    qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
  };

  const wa = (phone: string) => {
    const d = phone.replace(/\D/g, "");
    return `https://wa.me/${d.length === 10 ? "91" + d : d}`;
  };

  return (
    <Panel title={`Enquiries (${data.length})`}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input className={cn(inputCls, "pl-9")} placeholder="Search name, phone, company…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <div className="-mx-4 mb-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <div className="flex w-max gap-1.5">
          {["open", "all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs capitalize transition-colors",
                filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"
              )}
            >
              {s} {s === "all" ? data.length : counts[s] ? `(${counts[s]})` : ""}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          <Send className="mx-auto mb-3 h-6 w-6 text-primary" />
          No enquiries here yet. New form submissions appear instantly and are sent to your Telegram.
        </div>
      ) : (
        <ul className="space-y-3">
          {shown.map((e) => {
            const open = openId === e.id;
            return (
              <li key={e.id} className="rounded-xl border border-border bg-background/40">
                <button className="flex w-full items-start gap-3 p-4 text-left" onClick={() => setOpenId(open ? null : e.id)}>
                  <span className={cn("mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", tone[e.status])}>{e.status}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {e.name}
                      {e.company && <span className="text-muted-foreground"> · {e.company}</span>}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {[e.service, e.budget].filter(Boolean).join(" · ") || e.message?.slice(0, 80) || "—"}
                    </span>
                  </span>
                  <span className="flex-shrink-0 text-right text-[11px] text-muted-foreground">
                    {new Date(e.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    <br />
                    {new Date(e.created_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                  </span>
                </button>
                {open && (
                  <div className="space-y-4 border-t border-border p-4">
                    <div className="flex flex-wrap gap-2">
                      {e.phone && (
                        <>
                          <a href={`tel:${e.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary"><Phone className="h-4 w-4" /> {e.phone}</a>
                          <a href={wa(e.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-medium text-[#06260f]"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                        </>
                      )}
                      {e.email && <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary"><Mail className="h-4 w-4" /> {e.email}</a>}
                    </div>
                    {e.message && <p className="whitespace-pre-line rounded-lg bg-card p-3 text-sm leading-relaxed">{e.message}</p>}
                    <dl className="grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                      <div><dt className="uppercase tracking-wide">Service</dt><dd className="text-foreground">{e.service || "—"}</dd></div>
                      <div><dt className="uppercase tracking-wide">Budget</dt><dd className="text-foreground">{e.budget || "—"}</dd></div>
                      <div><dt className="uppercase tracking-wide">Page</dt><dd className="truncate text-foreground">{e.source_page || "—"}</dd></div>
                      <div><dt className="uppercase tracking-wide">Telegram</dt><dd className="text-foreground">{e.telegram_sent ? "Sent ✓" : "Not sent"}</dd></div>
                    </dl>
                    <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
                      <select className={inputCls} value={e.status} onChange={(ev) => update(e.id, { status: ev.target.value })}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
                      </select>
                      <textarea
                        className={inputCls}
                        rows={2}
                        placeholder="Private notes (only you see these)"
                        defaultValue={e.admin_notes || ""}
                        onBlur={(ev) => ev.target.value !== (e.admin_notes || "") && update(e.id, { admin_notes: ev.target.value || null })}
                      />
                    </div>
                    <div className="flex justify-end">
                      <ConfirmDelete onConfirm={() => remove(e.id)} />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
