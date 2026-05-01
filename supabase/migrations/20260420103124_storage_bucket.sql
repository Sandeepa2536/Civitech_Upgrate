-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Public for now as no auth is configured in schema)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

CREATE POLICY "Allow All"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Allow All Update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'project-images');

CREATE POLICY "Allow All Delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'project-images');
