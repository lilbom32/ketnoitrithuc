# CLB Kết nối tri thức — Blog Workflow Guide

> Hướng dẫn đầy đủ để tạo và publish bài viết KnowledgeHub.
> Bất kỳ ai (hoặc AI nào) đều có thể follow guide này độc lập.

---

## Tổng quan pipeline

```
VIẾT → HUMANIZE → PUSH → PUBLISH
  ↓        ↓         ↓        ↓
 AI      AI fix    Script   Admin
```

**Thời gian ước tính per bài:** 15–25 phút
**Yêu cầu:** Dev server chạy (`npm run dev` tại `/app`)

---

## Bước 1 — Viết draft (travel-copywriter)

**Prompt Claude:**
```
/travel-copywriter

Viết bài về: [TOPIC]
Category: [thuc-chien / tri-thuc]
Target reader: travel agents, tour operators, hospitality managers VN
```

**Category guide:**
| Category | Nội dung |
|----------|---------|
| `thuc-chien` | Operational — quy trình, kỹ năng, case study, how-to |
| `tri-thuc` | Strategic — xu hướng, market insight, phân tích ngành |

**Output cần có:**
- [ ] H2 headings rõ ràng (3–5 section)
- [ ] 1 pull quote hoặc info box (`:::info ... :::`)
- [ ] CTA cuối (`:::cta ... :::`)
- [ ] Độ dài: 1200–2000 từ
- [ ] Có ít nhất 1 con số / stat thực tế mỗi section

---

## Bước 2 — Humanize (anti-ai-writing)

**Prompt Claude ngay sau Bước 1:**
```
/anti-ai-writing

[Dán toàn bộ markdown draft từ Bước 1]
```

**Checklist trước khi pass:**
- [ ] Không có: "đóng vai trò quan trọng", "không thể phủ nhận", "thiết thực và hiệu quả"
- [ ] Không có: "không chỉ X mà còn Y" (negative parallelism)
- [ ] Câu mở đoạn có lập trường cụ thể, không phải "Trong bối cảnh..."
- [ ] Nhịp điệu đa dạng — có câu ngắn tạo nhấn
- [ ] Giọng điệu: đồng nghiệp B2B, không phải giáo sư

---

## Bước 3 — Điền metadata

Copy `scripts/article-template.json` thành file mới:

```bash
cp scripts/article-template.json scripts/my-article.json
```

Điền các field:

```json
{
  "title": "Tiêu đề tiếng Việt (50–70 ký tự)",
  "slug": "",
  "category": "thuc-chien",
  "excerpt": "Mô tả 1–2 câu cho card preview (100–150 ký tự)",
  "author": "Ban Biên Tập",
  "reading_time": 8,
  "cover_image_url": null,
  "content": "[PASTE TOÀN BỘ MARKDOWN TỪ BƯỚC 2]"
}
```

**Lưu ý:**
- `slug`: để trống → tự động generate từ title
- `reading_time`: đếm ~ 200 từ/phút → bài 1600 từ = 8 phút
- `cover_image_url`: null nếu chưa có ảnh

---

## Bước 4 — Push lên database

**Yêu cầu:** Dev server đang chạy tại `localhost:3000`

```bash
cd app
node scripts/blog-pipeline.mjs scripts/my-article.json
```

**Output mong đợi:**
```
🚀  CLB Blog Pipeline — Stage 3
──────────────────────────────────────────────────
📝  Title    : Tên bài viết
🔖  Slug     : ten-bai-viet
📂  Category : thuc-chien
⏱   Read time: 8 phút
──────────────────────────────────────────────────

[1/3] Đang push lên database...
✅  Đã tạo article (id: abc-123)

[2/3] Đang trigger ISR revalidation...
✅  Revalidated: /kien-thuc, /kien-thuc/ten-bai-viet

[3/3] Lưu archive...
✅  Archive: copywriter-1.json

══════════════════════════════════════════════════
✨  PIPELINE HOÀN TẤT
──────────────────────────────────────────────────
🔧  Admin edit : http://localhost:3000/admin/articles/abc-123
🌐  Preview    : http://localhost:3000/kien-thuc/ten-bai-viet
```

---

## Bước 5 — Publish

1. Mở link admin từ output trên
2. Review nội dung, chỉnh sửa nếu cần (markdown editor có preview)
3. Thêm `cover_image_url` nếu có ảnh
4. Bấm **Publish** → bài xuất hiện ngay trên `/kien-thuc`

---

## Cấu trúc markdown chuẩn cho bài viết

```markdown
Hook mở đầu mạnh — 2–3 câu, không "Trong bối cảnh..."

## Heading Section 1

Nội dung với ít nhất 1 con số thực tế.

:::info
**Insight nhanh:** Điểm quan trọng cần nhớ.
:::

## Heading Section 2

## Heading Section 3

> "Pull quote có thể trích từ expert hoặc data point đáng nhớ."

## Heading Section 4

## Kết luận

:::cta
**[CTA Title]**
Mô tả ngắn kêu gọi hành động.
[Link text →](/trang-lien-quan)
:::
```

---

## Troubleshooting

| Lỗi | Nguyên nhân | Fix |
|-----|------------|-----|
| `ADMIN_SECRET chưa được set` | Thiếu env var | Thêm `ADMIN_SECRET=...` vào `.env.local` |
| `Không thể kết nối server` | Dev server chưa chạy | `npm run dev` |
| `Slug đã tồn tại` | Slug trùng | Đổi slug trong JSON, thêm hậu tố `-2` |
| `title và category là bắt buộc` | JSON thiếu field | Kiểm tra lại JSON template |

---

## Quick prompt template cho người mới

Copy nguyên block này và điền vào:

```
Hãy tạo bài viết cho CLB Kết nối tri thức theo workflow sau:

TOPIC: [điền topic]
CATEGORY: [thuc-chien hoặc tri-thuc]
ANGLE: [góc nhìn cụ thể, ví dụ: "từ góc nhìn tour operator nhỏ tại tỉnh"]

Bước 1: Dùng /travel-copywriter viết draft
Bước 2: Dùng /anti-ai-writing humanize
Bước 3: Tạo JSON và chạy node scripts/blog-pipeline.mjs
```

---

*Last updated: 2026-03-15 | Stack: Next.js 15 + Supabase + Tailwind*
