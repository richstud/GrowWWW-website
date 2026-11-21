import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";
import { GoldField } from "@/components/GoldField";
import { inputCls } from "@/components/admin/shared";
import logo from "@/assets/growww-logo-full.png";

export default function Admin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin/dashboard", { replace: true });
    });
  }, [navigate]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setMsg({ kind: "error", text: error.message === "Invalid login credentials" ? "Wrong email or password." : error.message });
    navigate("/admin/dashboard", { replace: true });
  };

  const reset = async () => {
    if (!email.trim()) return setMsg({ kind: "error", text: "Type your email first, then press 'Forgot password'." });
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin/dashboard#settings` });
    setMsg(error ? { kind: "error", text: error.message } : { kind: "info", text: "If that email is an admin, a reset link is on its way." });
  };

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <Seo title="Admin | GrowWWW" noindex />
      <GoldField className="-z-10 opacity-60" />
      <div className="w-full max-w-md rounded-3xl border border-primary/25 bg-card/90 p-6 shadow-elegant backdrop-blur sm:p-8">
        <Link to="/" className="mx-auto mb-6 block w-fit">
          <img src={logo} alt="GrowWWW" className="h-16 w-16 object-contain" />
        </Link>
        <h1 className="text-center font-display text-2xl font-bold text-gradient-gold sm:text-3xl">Admin login</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Manage enquiries, portfolio, products and site content.</p>
        <form onSubmit={login} className="mt-6 space-y-3">
          <label className="sr-only" htmlFor="admin-email">Email</label>
          <input id="admin-email" type="email" autoComplete="username" className={inputCls} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="relative">
            <label className="sr-only" htmlFor="admin-pw">Password</label>
            <input id="admin-pw" type={show ? "text" : "password"} autoComplete="current-password" className={`${inputCls} pr-11`} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground" aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {msg && <p className={`rounded-lg px-3 py-2 text-sm ${msg.kind === "error" ? "bg-destructive/15 text-red-300" : "bg-primary/10 text-primary"}`}>{msg.text}</p>}
          <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold px-4 py-3 font-semibold text-primary-foreground shadow-gold-glow disabled:opacity-70">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Sign in
          </button>
          <button type="button" onClick={reset} className="w-full text-center text-xs text-muted-foreground hover:text-primary">Forgot password?</button>
        </form>
      </div>
    </div>
  );
}
