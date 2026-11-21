-- GrowWWW website - core schema (already applied to project aryvikihjbpedoytwkxc on 10 Nov 2026).

-- ===== Roles =====
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'anxsriv173@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.handle_new_admin_user() FROM anon, authenticated, public;
CREATE TRIGGER on_auth_user_created_admin AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ===== Client logos =====
CREATE TABLE public.client_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  logo_url text NOT NULL,
  website_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read logos" ON public.client_logos FOR SELECT USING (true);
CREATE POLICY "Admins write logos" ON public.client_logos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.client_logos (company_name, logo_url, display_order) VALUES
  ('Claim en Suure', '/client-logos/claimensuure.png', 1),
  ('Indalkar Gold Empire', '/client-logos/indalkar-gold-empire.png', 2),
  ('Smart Protocol Solutions', '/client-logos/smart-protocol-solutions.png', 3),
  ('VS', '/client-logos/vs.png', 4),
  ('Wizard Company', '/client-logos/wizard.jpeg', 5),
  ('Circle Logo Company', '/client-logos/circle-logo.jpeg', 6);

-- ===== Products =====
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  description text,
  video_url text,
  thumbnail_url text,
  price_label text,
  cta_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active products" ON public.products FOR SELECT
  USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Portfolio =====
CREATE TABLE public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  client_name text NOT NULL,
  industry text,
  location text,
  services text[] NOT NULL DEFAULT '{}',
  summary text,
  challenge text,
  solution text,
  result text,
  logo_url text,
  cover_url text,
  gallery text[] NOT NULL DEFAULT '{}',
  website_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published projects" ON public.portfolio_projects FOR SELECT
  USING (is_published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write projects" ON public.portfolio_projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER portfolio_updated BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Editable site content (key -> JSON) =====
CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins write content" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_content_updated BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Enquiries (written only by the submit-enquiry edge function) =====
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email text CHECK (email IS NULL OR char_length(email) <= 200),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 30),
  company text CHECK (company IS NULL OR char_length(company) <= 150),
  service text CHECK (service IS NULL OR char_length(service) <= 80),
  budget text CHECK (budget IS NULL OR char_length(budget) <= 60),
  message text CHECK (message IS NULL OR char_length(message) <= 4000),
  source_page text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','proposal','won','lost','spam')),
  admin_notes text,
  telegram_sent boolean NOT NULL DEFAULT false,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX contact_submissions_created_idx ON public.contact_submissions (created_at DESC);
CREATE INDEX contact_submissions_ip_idx ON public.contact_submissions (ip_hash, created_at DESC);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage enquiries" ON public.contact_submissions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===== Grants =====
GRANT SELECT ON public.client_logos, public.products, public.portfolio_projects, public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.client_logos, public.products, public.portfolio_projects, public.site_content TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

-- ===== Storage buckets (public images, admin-only uploads) =====
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('client-logos', 'client-logos', true, 5242880, ARRAY['image/png','image/jpeg','image/webp','image/svg+xml']),
  ('portfolio', 'portfolio', true, 10485760, ARRAY['image/png','image/jpeg','image/webp','image/svg+xml']),
  ('products', 'products', true, 52428800, ARRAY['image/png','image/jpeg','image/webp','video/mp4','video/webm'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins upload site media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('client-logos','portfolio','products') AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('client-logos','portfolio','products') AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('client-logos','portfolio','products') AND public.has_role(auth.uid(), 'admin'));

-- ===== Realtime for the admin inbox =====
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_submissions;
