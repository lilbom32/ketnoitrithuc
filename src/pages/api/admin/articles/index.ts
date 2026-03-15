import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';
import { requireAdminSecret } from '@/components/admin/AdminAuthGate';

function slugify(text: string): string {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminSecret(req as any, res as any)) return;

  const admin = createAdminClient();

  if (req.method === 'GET') {
    const { data, error } = await admin
      .from('articles')
      .select('id, title, slug, category, author, reading_time, published, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { title, slug, content, excerpt, cover_image_url, category, reading_time, author, published } =
      req.body as Record<string, unknown>;

    if (!title || !category) {
      return res.status(400).json({ error: 'title và category là bắt buộc' });
    }

    const finalSlug = (slug as string)?.trim() || slugify(title as string);

    const { data, error } = await admin
      .from('articles')
      .insert({
        title,
        slug: finalSlug,
        content: content ?? null,
        excerpt: excerpt ?? null,
        cover_image_url: cover_image_url ?? null,
        category,
        reading_time: reading_time ?? 5,
        author: author ?? null,
        published: published ?? false,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Slug đã tồn tại' });
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
