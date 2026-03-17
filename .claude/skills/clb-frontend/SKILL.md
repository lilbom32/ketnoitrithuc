---
name: clb-frontend
description: Build, modify, or style React/TSX components and pages for the "CLB Tri Thức" website. Use this skill when asked to create new pages, update UI components, fix styling issues, or add new sections. The site runs on Next.js 15 Pages Router + Tailwind CSS. Magazine-editorial aesthetic targeting premium knowledge community members.
---

# CLB Frontend Skill

## Tech Stack
- **Framework**: Next.js 15 (Pages Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS — use utility classes, NOT vanilla CSS
- **Database**: Supabase PostgreSQL (`src/lib/supabase.ts`)
- **Auth**: Supabase Auth + `@supabase/ssr` (Pages Router pattern)
- **i18n**: i18next v25 + react-i18next v16 (`src/i18n/`, 6 locales)
- **Dev server**: `npm run dev` (port 3000)

## Project Structure
```
src/
├── pages/
│   ├── _app.tsx            # ThemeProvider + ErrorBoundary
│   ├── _document.tsx       # HTML shell, fonts, JSON-LD
│   ├── index.tsx           # Home page (SSG)
│   ├── kien-thuc/
│   │   ├── index.tsx       # KnowledgeHub article grid (ISR)
│   │   └── [slug].tsx      # Single article (ISR + fallback:blocking)
│   ├── viec-lam/
│   │   └── index.tsx       # Job board (ISR)
│   └── tai-nguyen/
│       └── index.tsx       # Resources / Tài nguyên (download-gated)
├── sections/               # Home page section components
├── components/
│   └── ErrorBoundary.tsx
├── lib/
│   ├── supabase.ts         # createClient + createAdminClient
│   ├── auth.ts             # getAuthUser, hasTierAccess, DOWNLOAD_LIMITS
│   └── database.types.ts   # ProfileRow, ArticleRow, JobRow, etc.
├── config/                 # Site content config modules
│   └── resources.ts        # Config for resources display (e.g. wineShowcaseConfig)
└── i18n/                   # i18next setup + locale JSONs
```

## Design System (Tailwind classes)
Always use these brand values — do NOT hardcode arbitrary hex codes:

| Token        | Value     | Usage                        |
|---|---|---|
| Academic Navy | `#1E2761` | Primary bg, headings, buttons |
| Swiss Red     | `#E63946` | Accent, category badge, hover |
| Ice Blue      | `#CADCFC` | Subtle bg, border accents      |

**Fonts** (loaded via `_document.tsx`):
- `font-serif` → Playfair Display (headings)
- Default sans → DM Sans (body)
- Dancing Script → decorative script text

## Design Thinking (run this before coding)

Before writing a single line, answer these 3 questions:
1. **Purpose**: What problem does this page/component solve for a travel professional?
2. **Differentiation**: What's the one visual moment that makes this UNFORGETTABLE?
3. **Execution level**: Match code complexity to ambition — a hero section deserves staggered animations; a utility filter deserves restraint.

## Aesthetic Direction
**Magazine-editorial**: Academic authority meets premium brand. Execute with precision — elegance comes from intentionality, not decoration.

Core principles:
- Generous whitespace, strong typographic hierarchy
- Swiss Red (`#E63946`) for premium signals and hover states
- Navy (`#1E2761`) for authority and primary backgrounds
- Hero sections: full-viewport with navy bg + white text
- Card grids: image-dominant, minimal text overlay
- Rounded-xl corners on cards, subtle hover shadows

**Motion**: Use animations at high-impact moments — page load staggered reveals (`animation-delay`), hover states that surprise, scroll-triggered entrances. One well-orchestrated sequence > scattered micro-interactions. Prefer CSS-only; use Framer Motion only if already in the project.

**Spatial composition**: Don't default to symmetric 3-column grids. Experiment with asymmetry, overlap, diagonal flow, grid-breaking elements where it serves the editorial tone.

**Backgrounds & depth**: Avoid flat solid colors on large sections. Layer subtle textures, gradient meshes, or noise overlays to create atmosphere — especially on hero and feature sections.

## Anti-Generic Rules (never do these)
- Never use system fonts or Inter/Roboto — the project already has Playfair Display + DM Sans, use them intentionally
- Never use purple-on-white gradient schemes — CLB palette is Navy/Red/Ice Blue
- Never use predictable "card grid on white" as the only layout pattern — vary with full-bleed sections, editorial columns, or asymmetric feature blocks
- Never add decorative elements that don't serve the editorial tone (no emoji, no rainbow gradients, no playful icons on B2B content)
- Never converge on "safe" component patterns — if it looks like a generic SaaS template, redesign it

## Supabase Patterns
```typescript
// Always use createAdminClient() in getStaticProps/getServerSideProps
import { createAdminClient } from '@/lib/supabase';

// ISR page pattern
export const getStaticProps: GetStaticProps = async () => {
  const admin = createAdminClient();
  const { data } = await admin
    .from('articles')
    .select('id, title, slug, excerpt, cover_image_url, category, reading_time, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .returns<ArticleCard[]>();

  return { props: { articles: data ?? [] }, revalidate: 60 };
};

// API routes: use createServerSupabaseClient for auth
import { createServerSupabaseClient } from '@/lib/auth';
```

## Database Tables
| Table           | Purpose                              |
|---|---|
| `profiles`      | Auth users + membership tier         |
| `documents`     | Download-gated knowledge library     |
| `articles`      | KnowledgeHub blog content            |
| `jobs`          | Job board listings                   |
| `download_logs` | Audit trail for document downloads   |

## i18n Pattern
```typescript
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
// Usage: {t('nav.knowledge')}
// Add keys to ALL 6 locale files: vi, en, zh, fr, ko, de
// Files: src/i18n/locales/{vi,en,zh,fr,ko,de}.json
```

## Page Template
```tsx
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { createAdminClient } from '@/lib/supabase';

interface Props { /* ... */ }

const MyPage: NextPage<Props> = ({ /* ... */ }) => {
  return (
    <>
      <Head>
        <title>Page Title | CLB Tri Thức</title>
        <meta name="description" content="..." />
      </Head>
      <main className="min-h-screen bg-white">
        {/* Hero section */}
        <section className="bg-[#1E2761] text-white py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Title</h1>
          </div>
        </section>
        {/* Content */}
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  return { props: { /* ... */ }, revalidate: 60 };
};

export default MyPage;
```

## Membership Tiers
- `visitor` — can read free content, no downloads
- `free`    — 10 downloads/month
- `premium` — unlimited downloads

Gate content server-side in API routes via `hasTierAccess(profile.membership_tier, requiredTier)`.
