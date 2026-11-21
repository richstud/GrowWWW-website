import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent, waLink } from "@/lib/content";
import { cn } from "@/lib/utils";

export const SERVICES = [
  "Website design & development",
  "E-commerce website",
  "Mobile app (Android / iOS)",
  "Custom software / CRM",
  "AI & business automation",
  "Algo trading software",
  "SEO & Google ranking",
  "Google / Meta ads",
  "Social media marketing",
  "Something else",
];
const BUDGETS = ["Not sure yet", "Under ₹25,000", "₹25,000 – ₹75,000", "₹75,000 – ₹2 lakh", "₹2 lakh+", "International (USD)"];

const field =
  "w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 md:text-sm";

interface Props {
  /** Pre-selects the service dropdown (e.g. on a service page). */
  service?: string;
  compact?: boolean;
  className?: string;
  idPrefix?: string;
}

/** Live enquiry form: saves to the admin inbox and sends a Telegram alert via the submit-enquiry function. */
export function EnquiryForm({ service, compact, className, idPrefix = "enq" }: Props) {
  const { pathname } = useLocation();
  const copy = useSiteContent("form");
  const contact = useSiteContent("contact");
  const startedAt = useRef(Date.now());
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    service: service || "",
    budget: "",
    message: "",
    website: "", // honeypot - real visitors never see this
  });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.phone.trim() && !form.email.trim()) return setError("Please add a phone number or email so we can reply.");
    setState("sending");
    const { data, error: fnError } = await supabase.functions.invoke("submit-enquiry", {
      body: { ...form, source_page: pathname, elapsed_ms: Date.now() - startedAt.current },
    });
    if (fnError || !data?.ok) {
      let msg = "Couldn't send right now. Please call or WhatsApp us.";
      try {
        const body = await (fnError as { context?: Response })?.context?.json();
        if (body?.error) msg = body.error;
      } catch {
        /* keep default */
      }
      setError(msg);
      setState("idle");
      return;
    }
    setState("done");
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "generate_lead", { form_service: form.service || "unspecified" });
  };

  const id = (n: string) => `${idPrefix}-${n}`;

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-primary/40 bg-gradient-gold-soft px-6 py-12 text-center"
            role="status"
            aria-live="polite"
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold shadow-gold-glow"
            >
              <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <h3 className="font-display text-2xl font-bold">{copy.success_title}</h3>
            <p className="mt-3 max-w-sm text-muted-foreground">{copy.success_message}</p>
            <a
              href={waLink(contact.whatsapp, `Hi GrowWWW, I just sent an enquiry from your website. My name is ${form.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <MessageCircle className="h-4 w-4" /> Need it sooner? WhatsApp us
            </a>
            <button
              type="button"
              onClick={() => {
                setForm((f) => ({ ...f, message: "", company: "" }));
                startedAt.current = Date.now();
                setState("idle");
              }}
              className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate className="space-y-3" initial={false} exit={{ opacity: 0 }}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor={id("name")} className="sr-only">Your name</label>
                <input id={id("name")} className={field} placeholder="Your name *" autoComplete="name" value={form.name} onChange={set("name")} required />
              </div>
              <div>
                <label htmlFor={id("phone")} className="sr-only">Phone / WhatsApp</label>
                <input id={id("phone")} className={field} placeholder="Phone / WhatsApp *" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />
              </div>
              <div>
                <label htmlFor={id("email")} className="sr-only">Email</label>
                <input id={id("email")} className={field} placeholder="Email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set("email")} />
              </div>
              <div>
                <label htmlFor={id("company")} className="sr-only">Company / website</label>
                <input id={id("company")} className={field} placeholder="Company or website" autoComplete="organization" value={form.company} onChange={set("company")} />
              </div>
              <div>
                <label htmlFor={id("service")} className="sr-only">Service</label>
                <select id={id("service")} className={cn(field, !form.service && "text-muted-foreground/70")} value={form.service} onChange={set("service")}>
                  <option value="">What do you need?</option>
                  {[...new Set([...(service && !SERVICES.includes(service) ? [service] : []), ...SERVICES])].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={id("budget")} className="sr-only">Budget</label>
                <select id={id("budget")} className={cn(field, !form.budget && "text-muted-foreground/70")} value={form.budget} onChange={set("budget")}>
                  <option value="">Budget (optional)</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor={id("message")} className="sr-only">Project details</label>
              <textarea id={id("message")} className={cn(field, "resize-y")} rows={compact ? 3 : 4} placeholder="Tell us a little about your project" value={form.message} onChange={set("message")} />
            </div>
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
              <label htmlFor={id("website")}>Leave this empty</label>
              <input id={id("website")} tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
            </div>
            {error && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={state === "sending"}
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-gold px-6 py-3.5 font-semibold text-primary-foreground shadow-gold-glow transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
              {state === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send enquiry <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-muted-foreground">We reply within 24–48 hours. Your details are only used to respond to you.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
