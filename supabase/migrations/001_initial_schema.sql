-- =============================================================================
-- CLB Tri Thức – Initial Database Schema
-- Run via: supabase db push  OR  copy-paste into Supabase SQL editor
-- =============================================================================

-- Membership tier enum
CREATE TYPE membership_tier AS ENUM ('visitor', 'free', 'premium');

-- ─────────────────────────────────────────────────────────────
-- profiles: extends auth.users with membership metadata
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- documents: knowledge resource library
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.documents (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  slug             TEXT        NOT NULL UNIQUE,
  description      TEXT,
  category         TEXT        NOT NULL,
  file_url         TEXT,                            -- storage path in "documents" bucket
  cover_url        TEXT,
  read_access      membership_tier NOT NULL DEFAULT 'visitor',   -- minimum to read online
  download_access  membership_tier NOT NULL DEFAULT 'free',      -- minimum to download
  published        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_category    ON public.documents (category);
CREATE INDEX idx_documents_published   ON public.documents (published);
CREATE INDEX idx_documents_read_access ON public.documents (read_access);

-- ─────────────────────────────────────────────────────────────
-- download_logs: audit trail + monthly counter source of truth
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.download_logs (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_id    UUID        NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  downloaded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_download_logs_user    ON public.download_logs (user_id, downloaded_at DESC);
CREATE INDEX idx_download_logs_doc     ON public.download_logs (document_id);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- profiles: users can only see and edit their own row
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    -- Users cannot self-upgrade their membership tier
    membership_tier = (SELECT membership_tier FROM public.profiles WHERE id = auth.uid())
  );

-- documents: public read for visitor-accessible docs; download gated by download_access
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

-- download_logs: users can only see their own logs
CREATE POLICY "download_logs_select_own" ON public.download_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Service role bypasses all RLS (used by API routes via createAdminClient)
