-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create client_logos table
CREATE TABLE public.client_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_order INTEGER DEFAULT 0
);

-- Enable RLS on client_logos
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

-- RLS policies for client_logos
CREATE POLICY "Anyone can view client logos"
  ON public.client_logos FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert client logos"
  ON public.client_logos FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update client logos"
  ON public.client_logos FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete client logos"
  ON public.client_logos FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create stats_counter table
CREATE TABLE public.stats_counter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  working_hours INTEGER NOT NULL DEFAULT 13500,
  completed_projects INTEGER NOT NULL DEFAULT 720,
  happy_clients INTEGER NOT NULL DEFAULT 480,
  awards_received INTEGER NOT NULL DEFAULT 120,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Insert initial stats
INSERT INTO public.stats_counter (working_hours, completed_projects, happy_clients, awards_received)
VALUES (13500, 720, 480, 120);

-- Enable RLS on stats_counter
ALTER TABLE public.stats_counter ENABLE ROW LEVEL SECURITY;

-- RLS policies for stats_counter
CREATE POLICY "Anyone can view stats"
  ON public.stats_counter FOR SELECT
  USING (true);

CREATE POLICY "Admins can update stats"
  ON public.stats_counter FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for contact_submissions
CREATE POLICY "Anyone can insert contact submissions"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to increment stats daily
CREATE OR REPLACE FUNCTION public.increment_daily_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.stats_counter
  SET 
    working_hours = working_hours + 8,
    completed_projects = completed_projects + 1,
    happy_clients = happy_clients + 1,
    last_updated = CURRENT_DATE
  WHERE last_updated < CURRENT_DATE;
END;
$$;