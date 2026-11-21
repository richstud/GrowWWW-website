import { useState, type ReactNode } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

export const Panel = ({ title, children, className, actions }: { title: string; children: ReactNode; className?: string; actions?: ReactNode }) => (
  <section className={cn("rounded-2xl border border-border bg-card p-4 sm:p-6", className)}>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h2 className="font-display text-lg font-bold text-gradient-gold sm:text-xl">{title}</h2>
      {actions}
    </div>
    {children}
  </section>
);

export const Field = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
  </label>
);

export const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 md:text-sm";

/** Fit an image onto a square dark tile (used for client logos so they all look consistent). */
export const fitOnTile = (file: File, size = 512): Promise<Blob> =>
  new Promise((resolve, reject) => {
    if (file.type === "image/svg+xml") return resolve(file);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, size, size);
      const max = size * 0.84;
      const s = Math.min(max / img.width, max / img.height);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (size - img.width * s) / 2, (size - img.height * s) / 2, img.width * s, img.height * s);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("Encode failed"))), "image/png");
    };
    img.onerror = () => reject(new Error("That file isn't a readable image"));
    img.src = URL.createObjectURL(file);
  });

/** Downscale large photos so pages stay fast (max 1920px, WebP). */
export const shrinkPhoto = (file: File, max = 1920): Promise<Blob> =>
  new Promise((resolve) => {
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return resolve(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      if (s === 1 && file.size < 600_000) return resolve(file);
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      const ctx = c.getContext("2d");
      if (!ctx) return resolve(file);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob((b) => resolve(b || file), "image/webp", 0.85);
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });

export async function uploadToBucket(bucket: string, blob: Blob, nameHint: string) {
  const ext = blob.type === "image/svg+xml" ? "svg" : blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : blob.type.startsWith("video/") ? blob.type.split("/")[1] : "jpg";
  const path = `${new Date().toISOString().slice(0, 10)}/${slugify(nameHint) || "file"}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, blob, { cacheControl: "31536000", contentType: blob.type || undefined });
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Image picker: uploads to a public bucket and returns the public URL. Also accepts a pasted URL. */
export function ImageUpload({
  bucket,
  value,
  onChange,
  label,
  hint,
  mode = "photo",
  accept = "image/png,image/jpeg,image/webp,image/svg+xml",
}: {
  bucket: string;
  value: string;
  onChange: (url: string) => void;
  label: string;
  hint?: string;
  mode?: "photo" | "logo" | "raw";
  accept?: string;
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const onFile = async (file: File) => {
    if (file.size > 25 * 1024 * 1024) return toast({ title: "File too large", description: "Max 25 MB", variant: "destructive" });
    setBusy(true);
    try {
      const blob = mode === "logo" ? await fitOnTile(file) : mode === "photo" ? await shrinkPhoto(file) : file;
      onChange(await uploadToBucket(bucket, blob, file.name.replace(/\.[^.]+$/, "")));
      toast({ title: "Uploaded", description: "Remember to press Save." });
    } catch (e) {
      toast({ title: "Upload failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <div className="flex items-start gap-3">
        <label
          className={cn(
            "flex h-24 w-24 flex-shrink-0 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed border-border bg-background/60 text-center transition-colors hover:border-primary",
            value && "border-solid"
          )}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) onFile(f);
          }}
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : value ? (
            /\.(mp4|webm)(\?|$)/.test(value) ? <span className="px-1 text-[10px] text-muted-foreground">Video uploaded</span> : <img src={value} alt="" className="h-full w-full bg-[#1a1a1a] object-contain" />
          ) : (
            <>
              <Upload className="h-5 w-5 text-primary" />
              <span className="text-[10px] text-muted-foreground">Upload</span>
            </>
          )}
          <input type="file" accept={accept} className="hidden" disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
        </label>
        <div className="min-w-0 flex-1 space-y-1.5">
          <input className={inputCls} placeholder="…or paste an image URL" value={value} onChange={(e) => onChange(e.target.value)} />
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          {value && (
            <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
              <X className="h-3 w-3" /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Chips input for short lists (services, tags). */
export function ChipsInput({ value, onChange, suggestions = [], placeholder }: { value: string[]; onChange: (v: string[]) => void; suggestions?: string[]; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = (s: string) => {
    const t = s.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-background p-2">
        {value.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs text-primary">
            {v}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== v))} aria-label={`Remove ${v}`}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-base outline-none md:text-sm"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
          }}
          onBlur={() => draft && add(draft)}
        />
      </div>
      {suggestions.filter((s) => !value.includes(s)).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.filter((s) => !value.includes(s)).map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary hover:text-primary">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Two-step delete button (browser confirm() dialogs are unreliable on phones). */
export function ConfirmDelete({ onConfirm, label = "Delete" }: { onConfirm: () => void; label?: string }) {
  const [armed, setArmed] = useState(false);
  return armed ? (
    <span className="inline-flex items-center gap-1">
      <button type="button" onClick={onConfirm} className="rounded-md bg-destructive px-2.5 py-1.5 text-xs font-medium text-destructive-foreground">Yes, delete</button>
      <button type="button" onClick={() => setArmed(false)} className="rounded-md border border-border px-2.5 py-1.5 text-xs">Cancel</button>
    </span>
  ) : (
    <button type="button" onClick={() => setArmed(true)} className="rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:border-destructive hover:text-destructive">
      {label}
    </button>
  );
}
