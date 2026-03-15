import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';
import { requireAdminSecret } from '@/components/admin/AdminAuthGate';

// Revalidate pages to update static content
async function revalidatePages(res: NextApiResponse, slug?: string) {
  try {
    await res.revalidate?.('/tai-nguyen');
    if (slug) {
      await res.revalidate?.(`/tai-nguyen/${slug}`);
    }
    console.log('[documents] Revalidated pages');
  } catch (err) {
    console.error('[documents] Revalidation error:', err);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminSecret(req as any, res as any)) return;

  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'Invalid id' });

  const admin = createAdminClient();

  if (req.method === 'GET') {
    const { data, error } = await admin.from('documents').select('*').eq('id', id).single();
    if (error) return res.status(error.code === 'PGRST116' ? 404 : 500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const { title, slug, description, category, file_url, cover_url, read_access, download_access, published } =
      req.body as Record<string, unknown>;

    // Get current doc to know slug for revalidation
    const { data: currentDoc } = await admin.from('documents').select('slug').eq('id', id).single();

    const { data, error } = await admin
      .from('documents')
      .update({
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(file_url !== undefined && { file_url }),
        ...(cover_url !== undefined && { cover_url }),
        ...(read_access !== undefined && { read_access }),
        ...(download_access !== undefined && { download_access }),
        ...(published !== undefined && { published }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Slug đã tồn tại' });
      return res.status(500).json({ error: error.message });
    }

    // Revalidate pages when document is updated
    // Only revalidate if published or if published status changed
    if (published !== undefined || data.published) {
      await revalidatePages(res, data.slug || currentDoc?.slug);
    }

    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { error } = await admin.from('documents').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
