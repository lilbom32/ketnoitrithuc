#!/usr/bin/env node
/**
 * CLB Kết nối tri thức — Blog Pipeline Script
 *
 * Usage:
 *   node scripts/blog-pipeline.mjs <path-to-article.json>
 *   node scripts/blog-pipeline.mjs scripts/article-template.json
 *
 * Workflow:
 *   Stage 3 của content pipeline (sau travel-copywriter + anti-ai-writing)
 *   1. Đọc article JSON
 *   2. Push lên Supabase qua Admin API (published: false = draft)
 *   3. Trigger ISR revalidation
 *   4. In ra admin URL để chỉnh sửa + publish
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Load .env.local ─────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌  .env.local không tìm thấy tại:', envPath);
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

// ── Slugify (tiếng Việt safe) ────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ── Auto-increment copywriter archive file ───────────────────────────────────
function nextCopywriterPath() {
  const files = fs.readdirSync(__dirname).filter(f => /^copywriter-\d+\.json$/.test(f));
  const nums = files.map(f => parseInt(f.match(/(\d+)/)[1]));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return path.join(__dirname, `copywriter-${next}.json`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  loadEnv();

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const ADMIN_SECRET = process.env.ADMIN_SECRET;

  if (!ADMIN_SECRET) {
    console.error('❌  ADMIN_SECRET chưa được set trong .env.local');
    process.exit(1);
  }

  // Đọc file JSON đầu vào
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('❌  Thiếu argument. Dùng: node scripts/blog-pipeline.mjs <path-to-article.json>');
    process.exit(1);
  }

  const resolvedInput = path.resolve(process.cwd(), inputPath);
  if (!fs.existsSync(resolvedInput)) {
    console.error('❌  File không tồn tại:', resolvedInput);
    process.exit(1);
  }

  let article;
  try {
    article = JSON.parse(fs.readFileSync(resolvedInput, 'utf8'));
  } catch (e) {
    console.error('❌  JSON không hợp lệ:', e.message);
    process.exit(1);
  }

  // Validate bắt buộc
  const { title, category, content } = article;
  if (!title || !category || !content) {
    console.error('❌  Thiếu field bắt buộc: title, category, content');
    process.exit(1);
  }
  if (!['thuc-chien', 'tri-thuc'].includes(category)) {
    console.error('❌  category phải là "thuc-chien" hoặc "tri-thuc"');
    process.exit(1);
  }

  const slug = article.slug?.trim() || slugify(title);
  const payload = {
    title,
    slug,
    content,
    excerpt: article.excerpt ?? null,
    cover_image_url: article.cover_image_url ?? null,
    category,
    reading_time: article.reading_time ?? 8,
    author: article.author ?? 'Ban Biên Tập',
    published: false, // luôn là draft khi push qua pipeline
  };

  console.log('\n🚀  CLB Blog Pipeline — Stage 3');
  console.log('─'.repeat(50));
  console.log(`📝  Title    : ${payload.title}`);
  console.log(`🔖  Slug     : ${payload.slug}`);
  console.log(`📂  Category : ${payload.category}`);
  console.log(`⏱   Read time: ${payload.reading_time} phút`);
  console.log('─'.repeat(50));

  // ── Step 1: Push to Supabase via Admin API ──────────────────────────────
  console.log('\n[1/3] Đang push lên database...');

  let createdArticle;
  try {
    const res = await fetch(`${BASE_URL}/api/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': ADMIN_SECRET,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('❌  API error:', data.error || res.statusText);
      process.exit(1);
    }

    createdArticle = data;
    console.log(`✅  Đã tạo article (id: ${createdArticle.id})`);
  } catch (e) {
    console.error('❌  Không thể kết nối server. Dev server đang chạy không?');
    console.error('    Chạy: npm run dev');
    process.exit(1);
  }

  // ── Step 2: Trigger ISR revalidation ───────────────────────────────────
  console.log('\n[2/3] Đang trigger ISR revalidation...');

  try {
    const res = await fetch(`${BASE_URL}/api/admin/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': ADMIN_SECRET,
      },
      body: JSON.stringify({ slug: createdArticle.slug }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log('✅  Revalidated:', data.revalidated?.join(', '));
    } else {
      console.warn('⚠️   Revalidation warning:', data.error);
    }
  } catch (e) {
    console.warn('⚠️   Revalidation bỏ qua (không ảnh hưởng đến draft)');
  }

  // ── Step 3: Archive JSON ────────────────────────────────────────────────
  console.log('\n[3/3] Lưu archive...');
  const archivePath = nextCopywriterPath();
  fs.writeFileSync(archivePath, JSON.stringify({ ...payload, id: createdArticle.id }, null, 2));
  console.log(`✅  Archive: ${path.basename(archivePath)}`);

  // ── Done ────────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(50));
  console.log('✨  PIPELINE HOÀN TẤT');
  console.log('─'.repeat(50));
  console.log(`🔧  Admin edit : ${BASE_URL}/admin/articles/${createdArticle.id}`);
  console.log(`🌐  Preview    : ${BASE_URL}/kien-thuc/${createdArticle.slug}`);
  console.log('─'.repeat(50));
  console.log('👉  Bước tiếp theo: Vào admin, chỉnh sửa nếu cần, rồi bấm Publish.');
  console.log('═'.repeat(50) + '\n');
}

main().catch(err => {
  console.error('❌  Lỗi không mong đợi:', err);
  process.exit(1);
});
