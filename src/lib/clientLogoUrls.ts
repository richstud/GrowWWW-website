import { publicFileUrl } from "@/integrations/supabase/client";

// Client logos live in the public "client-logos" storage bucket (or /public/client-logos for the bundled ones).
const BUCKET = "client-logos";

type LogoRecord = { logo_url: string };
export type LogoRecordWithDisplayUrl<T extends LogoRecord> = T & { display_logo_url: string };

export const resolveClientLogoDisplayUrl = async (logoUrl: string) => publicFileUrl(BUCKET, logoUrl?.replace(/^storage:\/?/, ""));

export const withClientLogoDisplayUrls = async <T extends LogoRecord>(logos: T[]) =>
  logos.map((logo) => ({ ...logo, display_logo_url: publicFileUrl(BUCKET, logo.logo_url?.replace(/^storage:\/?/, "")) })) as LogoRecordWithDisplayUrl<T>[];
