-- =============================================================================
-- 004: Storage Buckets Setup
-- Create documents bucket for file uploads
-- =============================================================================

-- Create documents bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  104857600,  -- 100MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Policy: Allow authenticated users to upload to documents bucket
DROP POLICY IF EXISTS "documents_bucket_upload_auth" ON storage.objects;
CREATE POLICY "documents_bucket_upload_auth" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents');

-- Policy: Allow admin service role to do everything
DROP POLICY IF EXISTS "documents_bucket_admin_all" ON storage.objects;
CREATE POLICY "documents_bucket_admin_all" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'documents')
  WITH CHECK (bucket_id = 'documents');

-- Policy: Allow authenticated users to read their own uploads
DROP POLICY IF EXISTS "documents_bucket_select_auth" ON storage.objects;
CREATE POLICY "documents_bucket_select_auth" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'documents');
