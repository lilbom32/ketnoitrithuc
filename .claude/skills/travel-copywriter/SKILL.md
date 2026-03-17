---
name: travel-copywriter
description: Rewrites or creates travel industry articles for the "Câu lạc bộ Tri thức Du lịch" website. Use this skill when asked to write, rewrite, humanize, or upgrade article content for the KnowledgeHub (Thực Chiến / Tri Thức sections). Produces magazine-quality, B2B-focused Vietnamese content with operational insights, pull quotes, info boxes, and CTAs. Targets professional travel agents, tour operators, and hospitality managers.
---

# Travel Copywriter — CLB Tri Thức Du Lịch

## Brand Voice
- **Tone**: Chuyên nghiệp nhưng sắc sảo — như một chuyên gia thực thụ đang chia sẻ bí kíp với đồng nghiệp, không phải giáo viên dạy học sinh.
- **Register**: B2B. Giả định người đọc đã có kinh nghiệm ngành. Không giải thích những khái niệm cơ bản.
- **Energy**: Trực tiếp, dứt khoát, có quan điểm. Tránh văn phong mơ hồ, trung lập.
- **Style reference**: Tatler × Harvard Business Review × Bloomberg Businessweek — nhưng bằng tiếng Việt.

## Article Structure (Required)

### Opening Hook
Bắt đầu bằng một scene cụ thể, con số gây sốc, hoặc câu hỏi đảo lộn nhận thức. KHÔNG bắt đầu bằng định nghĩa hay giới thiệu chung chung.

### Body (Per Section)
- Dùng `## Heading` cho các phần chính
- Dùng `### Sub-heading` cho các điểm nhỏ
- Danh sách bullets với **bold key terms** cho KPIs và quy tắc vận hành
- Ảnh minh họa: `![alt text](unsplash_url?w=1200&q=80)` — 1-2 ảnh nội tuyến
- Pull-quote: `> "Câu trích dẫn sắc bén, có tính tư duy cao"`

### Info Boxes (Sử dụng khi có insight đặc biệt)
```
:::info
**Tiêu đề box:** Nội dung tip/cảnh báo/bí kíp thực chiến
:::
```

### CTA Box (Bắt buộc ở cuối)
```
:::cta
**Tiêu đề kêu gọi hành động**
Mô tả giá trị ngắn gọn, compelling.

[Text nút →](/đường-dẫn)
:::
```

## Content Standards

### Vocabulary to Use
- Thuật ngữ nghề: SOP, allotment, lead-time, F&B, MICE, bleisure, HNWI, buyout, RFP
- Số liệu và % cụ thể (có thể hợp lý hóa, không bịa đặt hoàn toàn)
- Tên thương hiệu thực tế: tên resort, hãng hàng không, chuỗi khách sạn

### Vocabulary to Avoid
- "Hành trình tuyệt vời", "trải nghiệm đáng nhớ", "vẻ đẹp thiên nhiên hoang sơ"
- Bất kỳ cụm từ nào nghe như marketing brochure bình dân
- Câu kết bằng "hy vọng bài viết hữu ích"

## Output & Pipeline

- **Output**: Markdown draft với đầy đủ structure (hook, body, pull quotes, CTA).
- **Humanize trước khi publish**: Luôn chạy **anti-ai-writing** sau khi viết draft để loại bỏ AI patterns.
- **Push vào DB**: Dùng skill **supabase-content-ops** để tạo script `copywriter-N.mjs` và cập nhật Supabase.

## References
- Article schema (supabase-content-ops): `id`, `title`, `content` (markdown), `cover_image_url`, `category`, `updated_at`
- Image source: Unsplash (use contextually relevant queries, not generic stock photos)
