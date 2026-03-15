-- =============================================================================
-- CLB Tri Thức – Articles & Jobs Schema
-- =============================================================================

-- ─────────────────────────────────────────────────────────────
-- articles: KnowledgeHub content (Thực Chiến + Tri Thức)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.articles (
  id               BIGSERIAL   PRIMARY KEY,
  title            TEXT        NOT NULL,
  slug             TEXT        NOT NULL UNIQUE,
  content          TEXT,                            -- Markdown body
  excerpt          TEXT,                            -- 1-2 sentence summary
  cover_image_url  TEXT,                            -- Unsplash URL ?w=1920&q=85
  category         TEXT        NOT NULL DEFAULT 'tri-thuc',  -- 'thuc-chien' | 'tri-thuc'
  reading_time     INTEGER     NOT NULL DEFAULT 5,  -- minutes (words / 200)
  author           TEXT,
  published        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_articles_slug      ON public.articles (slug);
CREATE INDEX idx_articles_category  ON public.articles (category);
CREATE INDEX idx_articles_published ON public.articles (published, created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- jobs: Job/opportunity listings
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.jobs (
  id             BIGSERIAL   PRIMARY KEY,
  title          TEXT        NOT NULL,
  company        TEXT        NOT NULL,
  location       TEXT,
  type           TEXT        NOT NULL DEFAULT 'full-time',  -- 'full-time' | 'part-time' | 'freelance'
  description    TEXT,                -- Markdown
  salary_range   TEXT,                -- e.g. "15-25 triệu"
  contact_email  TEXT,
  published      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_published ON public.jobs (published, created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs     ENABLE ROW LEVEL SECURITY;

-- Articles: anyone can read published articles
CREATE POLICY "articles_read_published" ON public.articles
  FOR SELECT USING (published = TRUE);

-- Jobs: anyone can read published jobs
CREATE POLICY "jobs_read_published" ON public.jobs
  FOR SELECT USING (published = TRUE);

-- Service role bypasses RLS for admin writes
