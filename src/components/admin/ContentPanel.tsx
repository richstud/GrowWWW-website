import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { DEFAULTS, type ContentKey } from "@/lib/content";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Field, Panel, inputCls } from "./shared";

type All = typeof DEFAULTS;

/** Edit the homepage hero, stats, contact details, offices, social links, testimonials and form messages. */
export function ContentPanel() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [c, setC] = useState<All>(DEFAULTS);
  const [saving, setSaving] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("key, value");
      if (error) throw error;
      return Object.fromEntries((data || []).map((r) => [r.key, r.value])) as Record<string, unknown>;
    },
  });

  useEffect(() => {
    if (!data) return;
    setC((prev) => {
      const next = { ...prev } as Record<string, unknown>;
      (Object.keys(DEFAULTS) as ContentKey[]).forEach((k) => {
        const v = data[k];
        if (v == null) return;
        next[k] = Array.isArray(DEFAULTS[k]) ? v : { ...(DEFAULTS[k] as object), ...(v as object) };
      });
      return next as All;
    });
  }, [data]);

  const save = async (key: ContentKey) => {
    setSaving(key);
    const { error } = await supabase.from("site_content").upsert({ key, value: c[key] as unknown as Json });
    setSaving(null);
    if (error) return toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
    toast({ title: "Saved", description: "The website shows the change on the next page load." });
    qc.invalidateQueries({ queryKey: ["site-content"] });
  };

  const patch = <K extends ContentKey>(key: K, v: Partial<All[K]> | All[K]) =>
    setC((prev) => ({ ...prev, [key]: Array.isArray(v) ? v : { ...(prev[key] as object), ...(v as object) } }));

  const SaveBtn = ({ k }: { k: ContentKey }) => (
    <Button size="sm" onClick={() => save(k)} disabled={saving === k}>{saving === k ? "Saving…" : "Save"}</Button>
  );

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 [&>*]:min-w-0">
      <Panel title="Homepage hero" actions={<SaveBtn k="hero" />}>
        <div className="space-y-4">
          <Field label="Small line above the headline"><input className={inputCls} value={c.hero.eyebrow} onChange={(e) => patch("hero", { eyebrow: e.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Headline"><input className={inputCls} value={c.hero.headline} onChange={(e) => patch("hero", { headline: e.target.value })} /></Field>
            <Field label="Gold highlighted words"><input className={inputCls} value={c.hero.highlight} onChange={(e) => patch("hero", { highlight: e.target.value })} /></Field>
          </div>
          <Field label="Sub-headline"><textarea className={inputCls} rows={3} value={c.hero.subheadline} onChange={(e) => patch("hero", { subheadline: e.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Main button"><input className={inputCls} value={c.hero.primary_cta} onChange={(e) => patch("hero", { primary_cta: e.target.value })} /></Field>
            <Field label="WhatsApp button"><input className={inputCls} value={c.hero.secondary_cta} onChange={(e) => patch("hero", { secondary_cta: e.target.value })} /></Field>
          </div>
        </div>
      </Panel>

      <Panel title="Stats under the hero" actions={<SaveBtn k="stats" />}>
        <p className="mb-3 text-xs text-muted-foreground">Numbers count up on screen, e.g. "150+", "2015", "98%". Use real figures only.</p>
        <div className="space-y-3">
          {c.stats.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <input className={inputCls} value={s.value} placeholder="150+" onChange={(e) => patch("stats", c.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
              <input className={inputCls} value={s.label} placeholder="Projects delivered" onChange={(e) => patch("stats", c.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
              <button className="rounded-md p-2 text-muted-foreground hover:text-destructive" onClick={() => patch("stats", c.stats.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {c.stats.length < 4 && <Button variant="outline" size="sm" onClick={() => patch("stats", [...c.stats, { value: "", label: "" }])}><Plus className="mr-1 h-4 w-4" /> Add stat</Button>}
        </div>
      </Panel>

      <Panel title="Contact details & offices" actions={<SaveBtn k="contact" />}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone"><input className={inputCls} value={c.contact.phone} onChange={(e) => patch("contact", { phone: e.target.value })} /></Field>
            <Field label="WhatsApp number" hint="Country code + number, digits only"><input className={inputCls} value={c.contact.whatsapp} onChange={(e) => patch("contact", { whatsapp: e.target.value.replace(/\D/g, "") })} /></Field>
            <Field label="Email"><input className={inputCls} value={c.contact.email} onChange={(e) => patch("contact", { email: e.target.value })} /></Field>
            <Field label="Business hours"><input className={inputCls} value={c.contact.hours} onChange={(e) => patch("contact", { hours: e.target.value })} /></Field>
          </div>
          <div className="space-y-3">
            <span className="block text-sm font-medium">Offices</span>
            {c.contact.offices.map((o, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-[1fr_1fr_auto]">
                <input className={inputCls} value={o.city} placeholder="City" onChange={(e) => patch("contact", { offices: c.contact.offices.map((x, j) => (j === i ? { ...x, city: e.target.value } : x)) })} />
                <input className={inputCls} value={o.region} placeholder="State" onChange={(e) => patch("contact", { offices: c.contact.offices.map((x, j) => (j === i ? { ...x, region: e.target.value } : x)) })} />
                <button className="justify-self-end rounded-md p-2 text-muted-foreground hover:text-destructive" onClick={() => patch("contact", { offices: c.contact.offices.filter((_, j) => j !== i) })} aria-label="Remove office"><Trash2 className="h-4 w-4" /></button>
                <input className={`${inputCls} sm:col-span-3`} value={o.address || ""} placeholder="Full street address (optional - helps Google Maps)" onChange={(e) => patch("contact", { offices: c.contact.offices.map((x, j) => (j === i ? { ...x, address: e.target.value } : x)) })} />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => patch("contact", { offices: [...c.contact.offices, { city: "", region: "", address: "" }] })}><Plus className="mr-1 h-4 w-4" /> Add office</Button>
          </div>
        </div>
      </Panel>

      <Panel title="Social links" actions={<SaveBtn k="socials" />}>
        <div className="space-y-3">
          {c.socials.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <input className={inputCls} value={s.label} placeholder="YouTube" onChange={(e) => patch("socials", c.socials.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
              <input className={inputCls} value={s.href} placeholder="https://" onChange={(e) => patch("socials", c.socials.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))} />
              <button className="rounded-md p-2 text-muted-foreground hover:text-destructive" onClick={() => patch("socials", c.socials.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => patch("socials", [...c.socials, { label: "", href: "" }])}><Plus className="mr-1 h-4 w-4" /> Add link</Button>
        </div>
      </Panel>

      <Panel title="Testimonials" actions={<SaveBtn k="testimonials" />}>
        <p className="mb-3 text-xs text-muted-foreground">Add real quotes from clients (with their permission). The section appears on the homepage once you add one.</p>
        <div className="space-y-3">
          {c.testimonials.map((t, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-border p-3">
              <textarea className={inputCls} rows={3} value={t.quote} placeholder="What the client said" onChange={(e) => patch("testimonials", c.testimonials.map((x, j) => (j === i ? { ...x, quote: e.target.value } : x)))} />
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_90px_auto]">
                <input className={inputCls} value={t.name} placeholder="Name" onChange={(e) => patch("testimonials", c.testimonials.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                <input className={inputCls} value={t.role || ""} placeholder="Role" onChange={(e) => patch("testimonials", c.testimonials.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))} />
                <input className={inputCls} value={t.company || ""} placeholder="Company" onChange={(e) => patch("testimonials", c.testimonials.map((x, j) => (j === i ? { ...x, company: e.target.value } : x)))} />
                <select className={inputCls} value={t.rating || 0} onChange={(e) => patch("testimonials", c.testimonials.map((x, j) => (j === i ? { ...x, rating: Number(e.target.value) || undefined } : x)))}>
                  <option value={0}>No stars</option>
                  {[5, 4, 3].map((n) => <option key={n} value={n}>{n} ★</option>)}
                </select>
                <button className="justify-self-end rounded-md p-2 text-muted-foreground hover:text-destructive" onClick={() => patch("testimonials", c.testimonials.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => patch("testimonials", [...c.testimonials, { name: "", quote: "", role: "", company: "" }])}><Plus className="mr-1 h-4 w-4" /> Add testimonial</Button>
        </div>
      </Panel>

      <Panel title="Form thank-you message" actions={<SaveBtn k="form" />}>
        <div className="space-y-4">
          <Field label="Title"><input className={inputCls} value={c.form.success_title} onChange={(e) => patch("form", { success_title: e.target.value })} /></Field>
          <Field label="Message"><textarea className={inputCls} rows={3} value={c.form.success_message} onChange={(e) => patch("form", { success_message: e.target.value })} /></Field>
        </div>
      </Panel>

      <Panel title="Announcement bar" actions={<SaveBtn k="announcement" />}>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm"><Switch checked={c.announcement.enabled} onCheckedChange={(v) => patch("announcement", { enabled: v })} /> Show a thin bar above the menu</label>
          <Field label="Text"><input className={inputCls} value={c.announcement.text} placeholder="Diwali offer: free SEO audit with every website" onChange={(e) => patch("announcement", { text: e.target.value })} /></Field>
          <Field label="Link (optional)"><input className={inputCls} value={c.announcement.link || ""} placeholder="/contact" onChange={(e) => patch("announcement", { link: e.target.value })} /></Field>
        </div>
      </Panel>
    </div>
  );
}
