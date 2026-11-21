import { useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Panel, inputCls } from "./shared";

const PROJECT = "aryvikihjbpedoytwkxc";

export function SettingsPanel({ email }: { email: string }) {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");

  const test = async () => {
    setTesting(true);
    setOk(null);
    const { data, error } = await supabase.functions.invoke("submit-enquiry", { body: { test: true } });
    setTesting(false);
    let body = data as { ok?: boolean; error?: string; telegram?: { ok: boolean; reason?: string }; sheet?: { ok: boolean; skipped?: boolean; reason?: string } } | null;
    if (error) {
      try {
        body = await (error as { context?: Response })?.context?.json();
      } catch {
        body = null;
      }
    }
    const tg = body?.telegram;
    const sheet = body?.sheet;
    const lines = [
      tg ? (tg.ok ? "Telegram: sent ✓" : `Telegram: ${tg.reason === "Telegram secrets not set" ? "add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID first" : tg.reason}`) : body?.error || "Telegram isn't connected yet.",
      sheet ? (sheet.ok ? "Google Sheet: test row added ✓" : sheet.skipped ? "Google Sheet: not connected yet (optional)" : `Google Sheet: ${sheet.reason}`) : "",
    ].filter(Boolean);
    const allGood = !!body?.ok;
    setOk(allGood);
    toast({ title: allGood ? "Sent!" : "Test needs attention", description: lines.join(" · "), variant: allGood ? undefined : "destructive" });
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 10) return toast({ title: "Use at least 10 characters", variant: "destructive" });
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return toast({ title: "Couldn't change password", description: error.message, variant: "destructive" });
    setPw("");
    toast({ title: "Password changed" });
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 [&>*]:min-w-0">
      <Panel title="Lead alerts: Telegram & Google Sheet">
        <p className="text-sm text-muted-foreground">Every form submission is saved in Enquiries, sent instantly to your Telegram and added as a row to your Google Sheet. The test button checks both.</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          <li>In Telegram, open <b>@BotFather</b>, send <code>/newbot</code>, follow the steps and copy the <b>bot token</b>.</li>
          <li>Open your new bot and press <b>Start</b> (or add it to a group).</li>
          <li>Get your <b>chat ID</b>: message <b>@userinfobot</b> - it replies with your ID (for a group, the ID starts with -100).</li>
          <li>
            In Supabase, open{" "}
            <a className="text-primary hover:underline" href={`https://supabase.com/dashboard/project/${PROJECT}/functions/secrets`} target="_blank" rel="noopener noreferrer">
              Edge Functions → Secrets <ExternalLink className="inline h-3 w-3" />
            </a>{" "}
            and add <code>TELEGRAM_BOT_TOKEN</code> and <code>TELEGRAM_CHAT_ID</code>. Optional: <code>SITE_ADMIN_URL</code> = https://www.growwww.in/admin/dashboard
          </li>
          <li>Google Sheet (optional): follow the steps in <code>SETUP.md</code> - paste the script into the sheet's Extensions → Apps Script, deploy it as a web app, and add <code>GOOGLE_SHEET_WEBHOOK_URL</code> and <code>GOOGLE_SHEET_SECRET</code> in the same Secrets page.</li>
          <li>Come back here and press the button.</li>
        </ol>
        <div className="mt-5 flex items-center gap-3">
          <Button onClick={test} disabled={testing}>
            {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Send test alert
          </Button>
          {ok && <span className="inline-flex items-center gap-1 text-sm text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Connected</span>}
        </div>
      </Panel>

      <Panel title="Your admin account">
        <p className="text-sm text-muted-foreground">Signed in as <b className="text-foreground">{email}</b>.</p>
        <form onSubmit={changePassword} className="mt-4 space-y-3">
          <label className="block text-sm font-medium" htmlFor="new-pw">New password</label>
          <input id="new-pw" type="password" autoComplete="new-password" className={inputCls} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 10 characters" />
          <Button type="submit" variant="outline">Change password</Button>
        </form>
      </Panel>
    </div>
  );
}
