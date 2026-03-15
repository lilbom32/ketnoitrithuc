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

// Revalidate pages to update static content
async function revalidatePages(res: NextApiResponse, slug?: string) {
  try {
    // Revalidate list page
    await res.revalidate?.('/tai-nguyen');
    
    // Revalidate detail page if slug provided
    if (slug) {
      await res.revalidate?.(`/tai-nguyen/${slug}`);
    }
    
    console.log('[documents] Revalidated pages');
  } catch (err) {
    console.error('[documents] Revalidation error:', err);
    // Don't throw - revalidation failure shouldn't break the request
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminSecret(req as any, res as any)) return;

  const admin = createAdminClient();

  if (req.method === 'GET') {
    const { data, error } = await admin
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const {
      title, slug, description, category, file_url, cover_url,
      read_access, download_access, published,
    } = req.body as Record<string, unknown>;

    if (!title || !category) {
      return res.status(400).json({ error: 'title và category là bắt buộc' });
    }

    const finalSlug = (slug as string)?.trim() || slugify(title as string);

    const { data, error } = await admin
      .from('documents')
      .insert({
        title,
        slug: finalSlug,
        description: description ?? null,
        category,
        file_url: file_url ?? null,
        cover_url: cover_url ?? null,
        read_access: read_access ?? 'visitor',
        download_access: download_access ?? 'free',
        published: published ?? false,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Slug đã tồn tại' });
      return res.status(500).json({ error: error.message });
    }

    // Revalidate pages to show new document
    await revalidatePages(res, finalSlug);

    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
