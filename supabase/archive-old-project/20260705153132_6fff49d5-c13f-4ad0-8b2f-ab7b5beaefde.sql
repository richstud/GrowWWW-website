
CREATE POLICY "Public read client-logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-logos');

CREATE POLICY "Admins insert client-logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'client-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update client-logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'client-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete client-logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'client-logos' AND public.has_role(auth.uid(), 'admin'));
