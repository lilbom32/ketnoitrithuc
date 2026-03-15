/**
 * Supabase database types for CLB Kết nối tri thức.
 *
 * Run `supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts`
 * to regenerate from your actual schema after running migrations.
 */

export type MembershipTier = 'visitor' | 'free' | 'premium';

// ─── Row types (what SELECT returns) ───────────────────────────────────────

export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  membership_tier: MembershipTier;
  downloads_this_month: number;
  downloads_reset_at: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  file_url: string | null;
  cover_url: string | null;
  read_access: MembershipTier;
  download_access: MembershipTier;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DownloadLogRow {
  id: string;
  user_id: string;
  document_id: string;
  downloaded_at: string;
}

export interface ArticleRow {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  category: 'thuc-chien' | 'tri-thuc';
  reading_time: number;
  author: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobRow {
  id: number;
  title: string;
  company: string;
  location: string | null;
  type: 'full-time' | 'part-time' | 'freelance';
  description: string | null;
  salary_range: string | null;
  contact_email: string | null;
  published: boolean;
  created_at: string;
}

// ─── Insert types ───────────────────────────────────────────────────────────

export interface ProfileInsert {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  membership_tier?: MembershipTier;
  downloads_this_month?: number;
  downloads_reset_at?: string;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentInsert {
  title: string;
  slug: string;
  description?: string | null;
  category: string;
  file_url?: string | null;
  cover_url?: string | null;
  read_access?: MembershipTier;
  download_access?: MembershipTier;
  published?: boolean;
}

export interface DownloadLogInsert {
  user_id: string;
  document_id: string;
}

export type ProfileUpdate = Partial<ProfileInsert>;

// ─── Database schema ────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
        Relationships: [];
      };
      documents: {
        Row: DocumentRow;
        Insert: DocumentInsert;
        Update: Partial<DocumentInsert>;
        Relationships: [];
      };
      download_logs: {
        Row: DownloadLogRow;
        Insert: DownloadLogInsert;
        Update: never;
        Relationships: [];
      };
      articles: {
        Row: ArticleRow;
        Insert: Partial<ArticleRow> & Pick<ArticleRow, 'title' | 'slug' | 'category'>;
        Update: Partial<ArticleRow>;
        Relationships: [];
      };
      jobs: {
        Row: JobRow;
        Insert: Partial<JobRow> & Pick<JobRow, 'title' | 'company'>;
        Update: Partial<JobRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      membership_tier: MembershipTier;
    };
    CompositeTypes: Record<string, never>;
  };
}
