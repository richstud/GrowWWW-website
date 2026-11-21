-- Insert client logos
INSERT INTO public.client_logos (company_name, logo_url, display_order) VALUES
  ('Claim en Suure', '/client-logos/claimensuure.png', 1),
  ('Indalkar Gold Empire', '/client-logos/indalkar-gold-empire.png', 2),
  ('Smart Protocol Solutions', '/client-logos/smart-protocol-solutions.png', 3),
  ('VS', '/client-logos/vs.png', 4),
  ('Wizard Company', '/client-logos/wizard.jpeg', 5),
  ('Circle Logo Company', '/client-logos/circle-logo.jpeg', 6);

-- Create function to auto-assign admin role to specific email
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Automatically assign admin role to the specified email
  IF NEW.email = 'Anxsriv173@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role);
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to assign admin role on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_admin_user();