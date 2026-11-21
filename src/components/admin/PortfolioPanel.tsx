import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Pencil, Plus, Star } from "lucide-react";
import { withClientLogoDisplayUrls } from "@/lib/clientLogoUrls";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ChipsInput, ConfirmDelete, Field, ImageUpload, Panel, inputCls, slugify } from "./shared";

type Project = Tables<"portfolio_projects">;
const norm = (v?: string | null) => (v || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const SERVICE_TAGS = ["Website", "E-commerce", "Mobile app", "Custom software", "Automation", "SEO", "Google Ads", "Social media", "Branding"];

const empty = {
  id: "",
  title: "",
  slug: "",
  client_name: "",
  industry: "",
  location: "",
  services: [] as string[],
  summary: "",
  challenge: "",
  solution: "",
  result: "",
  logo_url: "",
  cover_url: "",
  gallery: [] as string[],
  website_url: "",
  is_featured: false,
  is_published: true,
  display_order: 0,
};

export function PortfolioPanel() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const editing = !!form.id;

  const { data = [] } = useQuery({
    queryKey: ["admin-portfolio"],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_projects").select("*").order("display_order").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  const { data: logos = [] } = useQuery({
    queryKey: ["admin-logos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("client_logos").select("*").order("display_order");
      if (error) throw error;
      return withClientLogoDisplayUrls(data || []);
    },
  });
  const projectFor = (name: string, logo?: string) => data.find((p) => norm(p.client_name) === norm(name) || (!!logo && p.logo_url === logo));

  const refresh = () => ["admin-portfolio", "portfolio", "admin-logos", "client-logos"].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));

  /** Click a client logo: open its story, or start one with the name and logo filled in. */
  const openClient = (l: (typeof logos)[number]) => {
    const p = projectFor(l.company_name, l.logo_url);
    if (p) return edit(p);
    setForm({ ...empty, client_name: l.company_name, logo_url: l.display_logo_url || l.logo_url, website_url: l.website_url || "", is_published: false });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.client_name) return toast({ title: "Add a title and client name", variant: "destructive" });
    const { id, ...rest } = form;
    const payload = {
      ...rest,
      slug: form.slug || slugify(`${form.client_name} ${form.title}`),
      industry: form.industry || null,
      location: form.location || null,
      summary: form.summary || null,
      challenge: form.challenge || null,
      solution: form.solution || null,
      result: form.result || null,
      logo_url: form.logo_url || null,
      cover_url: form.cover_url || null,
      website_url: form.website_url || null,
      display_order: Number(form.display_order) || 0,
    };
    const { error } = editing ? await supabase.from("portfolio_projects").update(payload).eq("id", id) : await supabase.from("portfolio_projects").insert(payload);
    if (error) return toast({ title: "Couldn't save", description: error.message.includes("duplicate") ? "That URL slug is already used - change the slug." : error.message, variant: "destructive" });
    // A new client with a logo also joins the logo strip on the homepage and Portfolio page.
    if (form.logo_url && !logos.some((l) => norm(l.company_name) === norm(form.client_name))) {
      await supabase.from("client_logos").insert({ company_name: form.client_name, logo_url: form.logo_url, website_url: form.website_url || null, display_order: logos.length + 1 });
    }
    toast({ title: editing ? "Project updated" : "Project added", description: form.is_published ? "It's live on the Portfolio page." : "Saved as hidden." });
    setForm(empty);
    setShowForm(false);
    refresh();
  };

  const toggle = async (p: Project, patch: Partial<Project>) => {
    const { error } = await supabase.from("portfolio_projects").update(patch).eq("id", p.id);
    if (error) return toast({ title: "Couldn't update", description: error.message, variant: "destructive" });
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
    if (error) return toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
    toast({ title: "Project deleted" });
    refresh();
  };

  const edit = (p: Project) => {
    setForm({
      ...empty,
      ...Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v ?? (Array.isArray((empty as Record<string, unknown>)[k]) ? [] : "")])),
    } as typeof empty);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const set = <K extends keyof typeof empty>(k: K, v: (typeof empty)[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr] [&>*]:min-w-0">
      {showForm ? (
        <Panel title={editing ? "Edit project" : "Add a project"}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Client / company name *">
                <input className={inputCls} value={form.client_name} onChange={(e) => set("client_name", e.target.value)} required />
              </Field>
              <Field label="Project title *" hint="e.g. Export catalogue website with WhatsApp enquiries">
                <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} required />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ImageUpload bucket="portfolio" mode="logo" label="Client logo" value={form.logo_url} onChange={(v) => set("logo_url", v)} hint="Any size - auto-fitted on a dark square." />
              <ImageUpload bucket="portfolio" label="Cover image / screenshot" value={form.cover_url} onChange={(v) => set("cover_url", v)} hint="Wide image, at least 1600px. Shown on the card." />
            </div>
            <Field label="Services delivered">
              <ChipsInput value={form.services} onChange={(v) => set("services", v)} suggestions={SERVICE_TAGS} placeholder="Type and press Enter" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Industry"><input className={inputCls} value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="Jewellery" /></Field>
              <Field label="Location"><input className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Mumbai" /></Field>
              <Field label="Client website"><input className={inputCls} value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://" /></Field>
            </div>
            <Field label="Short summary" hint="1–2 sentences. Shown on the card and in Google.">
              <textarea className={inputCls} rows={2} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
            </Field>
            <Field label="The issue" hint="What was wrong or missing before? e.g. Old website, no enquiries from Google, orders taken by phone only.">
              <textarea className={inputCls} rows={3} value={form.challenge} onChange={(e) => set("challenge", e.target.value)} />
            </Field>
            <Field label="What we fixed" hint="What GrowWWW did - website, app, automation, SEO…">
              <textarea className={inputCls} rows={3} value={form.solution} onChange={(e) => set("solution", e.target.value)} />
            </Field>
            <Field label="The result" hint="Real numbers work best - e.g. 3× more enquiries, page 1 on Google, orders now come in on WhatsApp.">
              <textarea className={inputCls} rows={3} value={form.result} onChange={(e) => set("result", e.target.value)} />
            </Field>
            <div>
              <span className="mb-1.5 block text-sm font-medium">Gallery (optional)</span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {form.gallery.map((g, i) => (
                  <ImageUpload key={g + i} bucket="portfolio" label={`Image ${i + 1}`} value={g} onChange={(v) => set("gallery", v ? form.gallery.map((x, j) => (j === i ? v : x)) : form.gallery.filter((_, j) => j !== i))} />
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => set("gallery", [...form.gallery, ""])}>
                <Plus className="mr-1 h-4 w-4" /> Add image
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="URL slug" hint={`growwww.in/portfolio/${form.slug || slugify(`${form.client_name} ${form.title}`) || "…"}`}>
                <input className={inputCls} value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="auto" />
              </Field>
              <Field label="Display order"><input type="number" className={inputCls} value={form.display_order} onChange={(e) => set("display_order", Number(e.target.value))} /></Field>
              <div className="flex flex-col justify-end gap-3 pb-1">
                <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_published} onCheckedChange={(v) => set("is_published", v)} /> Published</label>
                <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_featured} onCheckedChange={(v) => set("is_featured", v)} /> Feature on homepage</label>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit">{editing ? "Save changes" : "Add project"}</Button>
              <Button type="button" variant="outline" onClick={() => { setForm(empty); setShowForm(false); }}>Cancel</Button>
            </div>
          </form>
        </Panel>
      ) : (
        <Panel title={`Your clients (${logos.length})`}>
          <p className="mb-5 text-sm text-muted-foreground">
            These are the logos on your homepage. Click a client to write their story - the issue, what you fixed and the result - then switch on Published. Visitors can then click the logo on the Portfolio page to read it.
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {logos.map((l) => {
              const p = projectFor(l.company_name, l.logo_url);
              const status = !p ? { text: "Add details", cls: "text-muted-foreground" } : p.is_published ? { text: "Published - edit", cls: "text-emerald-400" } : { text: "Draft - add details", cls: "text-primary" };
              return (
                <li key={l.id}>
                  <button type="button" onClick={() => openClient(l)} className="group flex w-full flex-col items-stretch rounded-xl border border-border p-2 text-left transition-colors hover:border-primary">
                    <span className="flex h-28 items-center justify-center overflow-hidden rounded-lg bg-[#1a1a1a] p-3">
                      <img src={l.display_logo_url || l.logo_url} alt="" className="max-h-full max-w-full object-contain" />
                    </span>
                    <span className="mt-2 truncate px-1 text-sm font-medium group-hover:text-primary">{l.company_name}</span>
                    <span className={`px-1 pb-1 text-xs ${status.cls}`}>{status.text}</span>
                  </button>
                </li>
              );
            })}
            <li>
              <button type="button" onClick={() => { setForm({ ...empty, is_published: false }); setShowForm(true); }} className="flex h-full min-h-[10.5rem] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Plus className="h-5 w-5" /> Add a new client
              </button>
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">A new client's logo is added to the homepage logo strip automatically when you save.</p>
        </Panel>
      )}

      <Panel title={`Client stories (${data.length})`}>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet.</p>
        ) : (
          <ul className="space-y-3">
            {data.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#1a1a1a]">
                  {p.logo_url || p.cover_url ? <img src={(p.logo_url || p.cover_url)!} alt="" className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-muted-foreground">—</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.client_name} · /portfolio/{p.slug}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button title={p.is_featured ? "Featured on homepage" : "Feature on homepage"} onClick={() => toggle(p, { is_featured: !p.is_featured })} className="rounded-md p-2 hover:bg-muted">
                    <Star className={`h-4 w-4 ${p.is_featured ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                  <button title={p.is_published ? "Published - click to hide" : "Hidden - click to publish"} onClick={() => toggle(p, { is_published: !p.is_published })} className="rounded-md p-2 hover:bg-muted">
                    {p.is_published ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  <button title="Edit" onClick={() => edit(p)} className="rounded-md p-2 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                  <ConfirmDelete onConfirm={() => remove(p.id)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
