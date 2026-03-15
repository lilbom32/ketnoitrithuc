#!/usr/bin/env node
/**
 * Push 5 articles batch — CLB Kết nối tri thức
 * Chạy: node scripts/push-5-articles.mjs
 * Yêu cầu: npm run dev đang chạy tại localhost:3000
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) { console.error('❌  .env.local không tìm thấy'); process.exit(1); }
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[k]) process.env[k] = v;
  }
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-');
}

async function pushArticle(filePath, baseUrl, adminSecret) {
  const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const slug = article.slug?.trim() || slugify(article.title);
  const payload = { ...article, slug, published: false };

  const res = await fetch(`${baseUrl}/api/admin/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminSecret },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || res.statusText);

  // Trigger revalidation
  await fetch(`${baseUrl}/api/admin/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminSecret },
    body: JSON.stringify({ slug: data.slug }),
  }).catch(() => {});

  return data;
}

async function main() {
  loadEnv();
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  if (!ADMIN_SECRET) { console.error('❌  ADMIN_SECRET chưa set trong .env.local'); process.exit(1); }

  const articles = [
    'article-1-allotment.json',
    'article-2-bleisure.json',
    'article-3-dynamic-pricing.json',
    'article-4-visa-egate.json',
    'article-5-cancellation.json',
  ];

  console.log('\n🚀  CLB Blog Pipeline — Push 5 bài viết');
  console.log('═'.repeat(55));

  const results = [];
  for (const file of articles) {
    const filePath = path.join(__dirname, file);
    process.stdout.write(`  Đang push ${file}... `);
    try {
      const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const data = await pushArticle(filePath, BASE_URL, ADMIN_SECRET);
      console.log(`✅  id: ${data.id}`);
      results.push({ file, id: data.id, slug: data.slug, title: article.title });
    } catch (e) {
      console.log(`❌  ${e.message}`);
      results.push({ file, error: e.message });
    }
  }

  console.log('\n' + '═'.repeat(55));
  console.log('📋  KẾT QUẢ:\n');
  for (const r of results) {
    if (r.error) {
      console.log(`  ❌  ${r.file}: ${r.error}`);
    } else {
      console.log(`  ✅  ${r.title.slice(0, 50)}...`);
      console.log(`      Admin: ${BASE_URL}/admin/articles/${r.id}`);
    }
  }

  const ok = results.filter(r => !r.error).length;
  console.log(`\n  ${ok}/${articles.length} bài push thành công.`);
  console.log('  👉  Vào /admin/articles để review và publish từng bài.');
  console.log('═'.repeat(55) + '\n');
}

main().catch(err => { console.error('❌  Lỗi:', err); process.exit(1); });
