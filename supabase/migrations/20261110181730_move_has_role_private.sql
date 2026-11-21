CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated;
ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated;
ALTER FUNCTION public.handle_new_admin_user() SET SCHEMA private;
