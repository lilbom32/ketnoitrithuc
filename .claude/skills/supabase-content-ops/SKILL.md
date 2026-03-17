---
name: supabase-content-ops
description: Manage content in the CLB Tri thức Du lịch Supabase database. Use this skill when asked to seed articles, update content, create batch update scripts, query the database, seed documents, update document metadata, or manage the content pipeline. Covers articles, jobs, documents (download-gated library), and download_logs.
---

# Supabase Content Operations

## Connection
```javascript
import { createClient } from '@supabase/supabase-js';
// Credentials are in .env — NEVER hardcode in new files
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
// For legacy scripts: credentials are hardcoded in existing copywriter-*.mjs files
```

## Database Schema

### `articles` table
| Column | Type | Notes |
|---|---|---|
| `id` | int8 | PK, auto-increment |
| `title` | text | Article title |
| `slug` | text | URL-friendly identifier |
| `content` | text | Markdown content |
| `excerpt` | text | Short summary (1-2 sentences) |
| `cover_image_url` | text | Unsplash URL `?w=1920&q=85` |
| `category` | text | `thuc-chien` \| `tri-thuc` |
| `reading_time` | int4 | Minutes (calculate: words/200) |
| `author` | text | Author name |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Update manually on each write |

### `jobs` table
| Column | Type | Notes |
|---|---|---|
| `id` | int8 | PK |
| `title` | text | Job title |
| `company` | text | Company name |
| `location` | text | City or Remote |
| `type` | text | `full-time` \| `part-time` \| `freelance` |
| `description` | text | Markdown |
| `salary_range` | text | e.g. "15-25 triệu" |
| `contact_email` | text | |
| `created_at` | timestamptz | |

### `documents` table
Download-gated knowledge library. Files stored in Supabase Storage.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `title` | text | Document title |
| `slug` | text | URL-friendly identifier |
| `description` | text | Short summary |
| `category` | text | Category for grouping |
| `file_url` | text | Storage path (e.g. `documents/slug/file.pdf`), NOT full URL |
| `cover_url` | text | Cover image URL |
| `read_access` | text | `visitor` \| `free` \| `premium` — minimum tier to view |
| `download_access` | text | Minimum tier to download |
| `published` | bool | Whether visible in UI |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### `download_logs` table
Audit trail for document downloads. Used for rate limiting (free tier: 10/month).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK to profiles |
| `document_id` | uuid | FK to documents |
| `downloaded_at` | timestamptz | |

## Batch Update Script Pattern
For updating multiple articles at once, create `copywriter-[N].mjs`:

```javascript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient('SUPABASE_URL', 'SUPABASE_KEY');

const updates = [
  {
    id: 5,
    cover_image_url: 'https://images.unsplash.com/photo-XXXXX?w=1920&q=85',
    content: `[MARKDOWN_CONTENT_HERE]`,
    excerpt: 'Mô tả ngắn 1-2 câu',
    reading_time: 7,
  },
  // ... more articles
];

async function main() {
  console.log(`\n🔄 Đang cập nhật ${updates.length} bài viết...\n`);
  let ok = 0, fail = 0;
  for (const u of updates) {
    const { id, ...fields } = u;
    const { error } = await supabase
      .from('articles')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) { console.log(`  ❌ ID ${id}: ${error.message}`); fail++; }
    else { console.log(`  ✅ ID ${id}: updated`); ok++; }
  }
  console.log(`\n✅ ${ok}/${updates.length} thành công\n`);
}
main();
```

Run with: `node copywriter-[N].mjs`

## Batch Document Seed Pattern
For seeding new documents into the download-gated library:

```javascript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const documents = [
  {
    title: 'Tên tài liệu',
    slug: 'ten-tai-lieu',
    description: 'Mô tả ngắn',
    category: 'category-name',
    file_url: 'documents/ten-tai-lieu/file.pdf',  // Storage path
    cover_url: 'https://images.unsplash.com/photo-XXX?w=800&q=80',
    read_access: 'free',
    download_access: 'free',
    published: true,
  },
];

async function main() {
  const { data, error } = await supabase.from('documents').insert(documents).select('id');
  if (error) console.error(error);
  else console.log(`Inserted ${data?.length} documents`);
}
main();
```

Upload files to Storage bucket first, then insert records. `file_url` must match the storage path.

## Existing Scripts Reference
- `copywriter-1.mjs` — Articles 1–4 (Hà Giang, Phú Quốc, Hội An, Visa Nhật)
- `copywriter-2.mjs` — Articles 5–8
- `copywriter-3.mjs` — Articles 9–12
- `update-articles.mjs`, `update-articles-2.mjs`, `update-articles-3.mjs` — Earlier update batches
- `seed-content.mjs` — Initial seed script
- `setup-supabase.mjs` — Table creation

## Image URL Convention
Always use Unsplash with these params:
- Cover images: `?w=1920&q=85`
- Inline article images: `?w=1200&q=80`
- Thumbnails: `?w=800&q=80`

## Content Categories
- `thuc-chien` — Operational/tactical articles (tour ops, logistics, SOP)
- `tri-thuc` — Knowledge/strategic articles (market analysis, trends, visa)
