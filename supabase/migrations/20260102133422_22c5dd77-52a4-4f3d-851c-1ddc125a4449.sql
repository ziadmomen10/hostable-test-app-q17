-- Create the page-assets bucket for storing page images like logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'page-assets',
  'page-assets',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
);

-- Allow authenticated users (admins) to upload files
CREATE POLICY "Authenticated users can upload page assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'page-assets');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update page assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'page-assets');

-- Allow authenticated users to delete page assets
CREATE POLICY "Authenticated users can delete page assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'page-assets');

-- Allow public read access for page assets (logos need to be visible)
CREATE POLICY "Public read access for page assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'page-assets');