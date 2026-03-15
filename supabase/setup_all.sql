-- =============================================================================
-- CLB Tri Thức — Full Database Setup (001 + 002 + 003 + Storage)
-- Chạy 1 lần trong Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/mujswdetpicqfqggiqkl/sql/new
-- =============================================================================

-- ─────────────────────────────────────────────────────────────
-- 000: Storage Buckets (must be created before using)
-- ─────────────────────────────────────────────────────────────

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

-- ─────────────────────────────────────────────────────────────
-- 001: Initial Schema
-- ─────────────────────────────────────────────────────────────

-- Membership tier enum
DO $$ BEGIN
  CREATE TYPE membership_tier AS ENUM ('visitor', 'free', 'premium');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- profiles: extends auth.users with membership metadata
CREATE TABLE IF NOT EXISTS public.profiles (
  id                    UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT,
  full_name             TEXT,
  avatar_url            TEXT,
  membership_tier       membership_tier NOT NULL DEFAULT 'free',
  downloads_this_month  INTEGER     NOT NULL DEFAULT 0,
  downloads_reset_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- documents: knowledge resource library
CREATE TABLE IF NOT EXISTS public.documents (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  slug             TEXT        NOT NULL UNIQUE,
  description      TEXT,
  category         TEXT        NOT NULL,
  file_url         TEXT,
  cover_url        TEXT,
  read_access      membership_tier NOT NULL DEFAULT 'visitor',
  download_access  membership_tier NOT NULL DEFAULT 'free',
  published        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_category    ON public.documents (category);
CREATE INDEX IF NOT EXISTS idx_documents_published   ON public.documents (published);
CREATE INDEX IF NOT EXISTS idx_documents_read_access ON public.documents (read_access);

-- download_logs: audit trail + monthly counter
CREATE TABLE IF NOT EXISTS public.download_logs (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_id    UUID        NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  downloaded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_download_logs_user ON public.download_logs (user_id, downloaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_download_logs_doc  ON public.download_logs (document_id);

-- Row Level Security
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- profiles policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    membership_tier = (SELECT membership_tier FROM public.profiles WHERE id = auth.uid())
  );

-- documents policy
DROP POLICY IF EXISTS "documents_read_visitor" ON public.documents;
CREATE POLICY "documents_read_visitor" ON public.documents
  FOR SELECT USING (
    published = TRUE
    AND (
      read_access = 'visitor'
      OR (
        read_access IN ('free', 'premium')
        AND auth.uid() IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid()
            AND (
              (read_access = 'free'    AND p.membership_tier IN ('free', 'premium'))
              OR (read_access = 'premium' AND p.membership_tier = 'premium')
            )
        )
      )
    )
  );

-- download_logs policy
DROP POLICY IF EXISTS "download_logs_select_own" ON public.download_logs;
CREATE POLICY "download_logs_select_own" ON public.download_logs
  FOR SELECT USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 002: Articles & Jobs
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.articles (
  id               BIGSERIAL   PRIMARY KEY,
  title            TEXT        NOT NULL,
  slug             TEXT        NOT NULL UNIQUE,
  content          TEXT,
  excerpt          TEXT,
  cover_image_url  TEXT,
  category         TEXT        NOT NULL DEFAULT 'tri-thuc',
  reading_time     INTEGER     NOT NULL DEFAULT 5,
  author           TEXT,
  published        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug      ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_category  ON public.articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles (published, created_at DESC);

CREATE TABLE IF NOT EXISTS public.jobs (
  id             BIGSERIAL   PRIMARY KEY,
  title          TEXT        NOT NULL,
  company        TEXT        NOT NULL,
  location       TEXT,
  type           TEXT        NOT NULL DEFAULT 'full-time',
  description    TEXT,
  salary_range   TEXT,
  contact_email  TEXT,
  published      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_published ON public.jobs (published, created_at DESC);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs     ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "articles_read_published" ON public.articles;
CREATE POLICY "articles_read_published" ON public.articles
  FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "jobs_read_published" ON public.jobs;
CREATE POLICY "jobs_read_published" ON public.jobs
  FOR SELECT USING (published = TRUE);

-- ─────────────────────────────────────────────────────────────
-- 003: Add phone to profiles
-- ─────────────────────────────────────────────────────────────

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- =============================================================================
-- Done. Kiểm tra bằng: SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- =============================================================================
