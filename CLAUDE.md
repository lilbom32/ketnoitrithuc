# Câu lạc bộ Tri thức Du lịch — Project Guide

## Project Overview
Website của **Câu lạc bộ Tri thức Du lịch** — cộng đồng B2B cho travel agents, tour operators, và hospitality managers tại Việt Nam.

- **Live stack**: Next.js 15 (Pages Router) + React 19 + TypeScript + Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Dev server**: `npm run dev` (port 3000)

---

## Content Pipeline (4-Stage Workflow)

Mọi bài viết mới đi qua 4 bước theo thứ tự:

```
[1] WRITE              →   [2] HUMANIZE         →   [3] PUSH              →   [4] UI
travel-copywriter          anti-ai-writing           supabase-content-ops      clb-frontend
```

### Stage 1 — Write: `travel-copywriter`
**Trigger**: Viết draft bài viết KnowledgeHub từ topic/brief.

Ví dụ:
- "Viết bài về quản lý allotment cho mùa cao điểm"
- "Draft bài về MICE tourism tại Đà Nẵng"
- "Viết bài tri-thuc về xu hướng bleisure 2025"

Output: Markdown draft với cấu trúc magazine (hook + body + pull quotes + CTA).

### Stage 2 — Humanize: `anti-ai-writing`
**Trigger**: LUÔN chạy sau Stage 1 trước khi publish. Loại bỏ AI-pattern, thêm giọng điệu thực.

Ví dụ:
- "Humanize bài draft này, bỏ văn phong ChatGPT"
- "Kiểm tra bài này có nghe như AI không"
- "Rewrite đoạn mở đầu cho tự nhiên hơn"

Checklist trước khi pass sang Stage 3:
- [ ] Không còn từ bị nhiễm: "đóng vai trò quan trọng", "không thể phủ nhận", "thiết thực và hiệu quả"
- [ ] Không có negative parallelism: "không chỉ X mà còn Y"
- [ ] Câu mở đoạn có lập trường cụ thể, không phải "trong bối cảnh..."
- [ ] Có ít nhất 1 con số / chi tiết thực tế per section
- [ ] Nhịp điệu đa dạng — có câu ngắn gây nhấn

Output: Markdown đã humanize, sẵn sàng publish.

### Stage 3 — Push: `supabase-content-ops`
**Trigger**: Sau khi bài đã pass Stage 2. Seed data, batch update, query DB.

Ví dụ:
- "Seed bài này vào Supabase với category thuc-chien"
- "Update excerpt và reading_time"
- "Xem danh sách bài chưa có cover_image_url"

Output: Script `copywriter-N.mjs`, chạy với `node copywriter-N.mjs`.

### Stage 4 — UI: `clb-frontend`
**Trigger**: Tạo trang mới, sửa component, thêm section, fix styling.

Ví dụ:
- "Tạo trang /su-kien với hero + card grid"
- "Sửa KnowledgeHub filter tabs"
- "Thêm badge 'Premium' vào article cards"

Output: TSX components/pages theo chuẩn Next.js Pages Router + Tailwind.

---

## Common Workflows

### New article, end-to-end
1. `/travel-copywriter` — viết draft
2. `/anti-ai-writing` — humanize, remove AI patterns
3. `/supabase-content-ops` — tạo script → `node copywriter-N.mjs`
4. Verify live tại `localhost:3000/kien-thuc`

### New page / feature
1. `/clb-frontend` — build component/page
2. Nếu cần data mới: `/supabase-content-ops` để seed

### Content refresh batch
1. `/supabase-content-ops` — query bài cần update
2. `/travel-copywriter` — rewrite từng bài
3. `/supabase-content-ops` — tạo batch update script

---

## Key Files

| Path | Purpose |
|---|---|
| `src/pages/kien-thuc/index.tsx` | KnowledgeHub grid (ISR) |
| `src/pages/kien-thuc/[slug].tsx` | Single article (ISR) |
| `src/pages/viec-lam/index.tsx` | Job board |
| `src/lib/supabase.ts` | DB client |
| `src/lib/auth.ts` | Auth + tier access |
| `copywriter-*.mjs` | Content update scripts |

## Design Tokens (never hardcode hex)
| Color | Value | Usage |
|---|---|---|
| Academic Navy | `#1E2761` | Primary bg, headings |
| Swiss Red | `#E63946` | Accent, hover, badges |
| Ice Blue | `#CADCFC` | Subtle bg, borders |

## Membership Tiers
`visitor` → free content only | `free` → 10 downloads/month | `premium` → unlimited
