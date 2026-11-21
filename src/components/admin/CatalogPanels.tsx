import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { withClientLogoDisplayUrls } from "@/lib/clientLogoUrls";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ConfirmDelete, Field, ImageUpload, Panel, inputCls, slugify } from "./shared";
import { youTubeId, youTubeThumb } from "@/lib/youtube";

/* ------------------------------ Products ------------------------------ */
type Product = Tables<"products">;
const emptyProduct = { id: "", name: "", slug: "", short_description: "", description: "", video_url: "", thumbnail_url: "", price_label: "", cta_url: "", display_order: 0, is_active: true };

export function ProductsPanel() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState(emptyProduct);
  const editing = !!form.id;
  const set = <K extends keyof typeof emptyProduct>(k: K, v: (typeof emptyProduct)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const { data = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("display_order");
      if (error) throw error;
      return data as Product[];
    },
  });
  const refresh = () => ["admin-products", "products", "products-nav"].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...rest } = form;
    const payload = {
      ...rest,
      slug: form.slug || slugify(form.name),
      short_description: form.short_description || null,
      description: form.description || null,
      video_url: form.video_url || null,
      thumbnail_url: form.thumbnail_url || null,
      price_label: form.price_label || null,
      cta_url: form.cta_url || null,
      display_order: Number(form.display_order) || 0,
    };
    const { error } = editing ? await supabase.from("products").update(payload).eq("id", id) : await supabase.from("products").insert(payload);
    if (error) return toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
    toast({ title: editing ? "Product updated" : "Product added" });
    setForm(emptyProduct);
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
    toast({ title: "Product deleted" });
    refresh();
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr] [&>*]:min-w-0">
      <Panel title={editing ? "Edit product" : "Add a product"}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name *"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} required /></Field>
            <Field label="URL slug" hint={`growwww.in/products/${form.slug || "…"}`}><input className={inputCls} value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} /></Field>
          </div>
          <Field label="Short description" hint="Shown in the menu and on the product card."><input className={inputCls} value={form.short_description} onChange={(e) => set("short_description", e.target.value)} /></Field>
          <Field label="YouTube video link" hint="On YouTube press Share, copy the link and paste it here - e.g. https://youtu.be/abc123XYZ00. It plays on the product page, and its thumbnail is used if you don't upload an image.">
            <input className={inputCls} value={form.video_url} onChange={(e) => set("video_url", e.target.value.trim())} placeholder="https://youtu.be/…" />
          </Field>
          {youTubeThumb(form.video_url) && (
            <img src={youTubeThumb(form.video_url)!} alt="Video preview" className="aspect-video w-full max-w-xs rounded-lg border border-border object-cover" />
          )}
          {form.video_url && !youTubeId(form.video_url) && !/vimeo\.com|\.(mp4|webm)/.test(form.video_url) && (
            <p className="text-xs text-destructive">That doesn't look like a YouTube link. Copy it from YouTube's Share button.</p>
          )}
          <Field label="Full description" hint="Paste the product description here. Leave an empty line between paragraphs; lines starting with - become bullet points."><textarea className={inputCls} rows={8} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUpload bucket="products" label="Thumbnail image" value={form.thumbnail_url} onChange={(v) => set("thumbnail_url", v)} />
            <ImageUpload bucket="products" mode="raw" accept="video/mp4,video/webm" label="Or upload a video file" value={/\.(mp4|webm)/.test(form.video_url) ? form.video_url : ""} onChange={(v) => set("video_url", v)} hint="Only if the video isn't on YouTube." />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price label" hint="e.g. From ₹4,999/yr"><input className={inputCls} value={form.price_label} onChange={(e) => set("price_label", e.target.value)} /></Field>
            <Field label="Button link (optional)" hint="Demo or buy link"><input className={inputCls} value={form.cta_url} onChange={(e) => set("cta_url", e.target.value)} placeholder="https://" /></Field>
            <Field label="Display order"><input type="number" className={inputCls} value={form.display_order} onChange={(e) => set("display_order", Number(e.target.value))} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} /> Visible on the website</label>
          <div className="flex gap-2">
            <Button type="submit">{editing ? "Save changes" : "Add product"}</Button>
            {editing && <Button type="button" variant="outline" onClick={() => setForm(emptyProduct)}>Cancel</Button>}
          </div>
        </form>
      </Panel>

      <Panel title={`Products (${data.length})`}>
        {data.length === 0 ? <p className="text-sm text-muted-foreground">No products yet.</p> : (
          <ul className="space-y-3">
            {data.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3">
                {p.thumbnail_url ? <img src={p.thumbnail_url} alt="" className="h-14 w-14 rounded-lg object-cover" /> : <div className="h-14 w-14 rounded-lg bg-muted" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.name} {!p.is_active && <span className="text-xs text-muted-foreground">(hidden)</span>}</p>
                  <p className="truncate text-xs text-muted-foreground">/products/{p.slug}</p>
                </div>
                <button title="Edit" className="rounded-md p-2 hover:bg-muted" onClick={() => { setForm(Object.fromEntries(Object.keys(emptyProduct).map((k) => [k, (p as Record<string, unknown>)[k] ?? (emptyProduct as Record<string, unknown>)[k]])) as typeof emptyProduct); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                  <Pencil className="h-4 w-4" />
                </button>
                <ConfirmDelete onConfirm={() => remove(p.id)} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

/* ------------------------------ Client logos ------------------------------ */
const emptyLogo = { id: "", company_name: "", logo_url: "", website_url: "", display_order: 0 };

export function LogosPanel() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState(emptyLogo);
  const editing = !!form.id;

  const { data = [] } = useQuery({
    queryKey: ["admin-logos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("client_logos").select("*").order("display_order");
      if (error) throw error;
      return withClientLogoDisplayUrls(data || []);
    },
  });
  const refresh = () => ["admin-logos", "client-logos"].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.logo_url) return toast({ title: "Upload a logo first", variant: "destructive" });
    const payload = { company_name: form.company_name, logo_url: form.logo_url, website_url: form.website_url || null, display_order: Number(form.display_order) || 0 };
    const { error } = editing ? await supabase.from("client_logos").update(payload).eq("id", form.id) : await supabase.from("client_logos").insert(payload);
    if (error) return toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
    toast({ title: editing ? "Logo updated" : "Logo added" });
    setForm(emptyLogo);
    refresh();
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("client_logos").delete().eq("id", id);
    if (error) return toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
    refresh();
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 [&>*]:min-w-0">
      <Panel title={editing ? "Edit client logo" : "Add a client logo"}>
        <p className="mb-4 text-sm text-muted-foreground">Logos appear in the "Trusted by" strip on the homepage and on the Portfolio page.</p>
        <form onSubmit={save} className="space-y-4">
          <Field label="Company name *"><input className={inputCls} value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} required /></Field>
          <ImageUpload bucket="client-logos" mode="logo" label="Logo *" value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} hint="Any size or format - fitted onto a dark square." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Website (optional)"><input className={inputCls} value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} /></Field>
            <Field label="Display order"><input type="number" className={inputCls} value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} /></Field>
          </div>
          <div className="flex gap-2">
            <Button type="submit"><Plus className="mr-1 h-4 w-4" />{editing ? "Save" : "Add logo"}</Button>
            {editing && <Button type="button" variant="outline" onClick={() => setForm(emptyLogo)}>Cancel</Button>}
          </div>
        </form>
      </Panel>
      <Panel title={`Client logos (${data.length})`}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.map((l) => (
            <li key={l.id} className="flex items-center gap-3 rounded-xl border border-border p-2">
              <img src={l.display_logo_url} alt="" className="h-14 w-14 rounded-lg bg-[#1a1a1a] object-contain" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{l.company_name}</p>
                <p className="text-xs text-muted-foreground">Order {l.display_order}</p>
              </div>
              <button title="Edit" className="rounded-md p-2 hover:bg-muted" onClick={() => setForm({ id: l.id, company_name: l.company_name, logo_url: l.logo_url, website_url: l.website_url || "", display_order: l.display_order })}>
                <Pencil className="h-4 w-4" />
              </button>
              <ConfirmDelete onConfirm={() => remove(l.id)} label="×" />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
