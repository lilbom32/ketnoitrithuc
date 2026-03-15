import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';
import { requireAdminSecret } from '@/components/admin/AdminAuthGate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminSecret(req as any, res as any)) return;

  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const admin = createAdminClient();

  if (req.method === 'GET') {
    const { data, error } = await admin.from('articles').select('*').eq('id', id).single();
    if (error) return res.status(error.code === 'PGRST116' ? 404 : 500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const { title, slug, content, excerpt, cover_image_url, category, reading_time, author, published } =
      req.body as Record<string, unknown>;

    const { data, error } = await admin
      .from('articles')
      .update({
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(cover_image_url !== undefined && { cover_image_url }),
        ...(category !== undefined && { category }),
        ...(reading_time !== undefined && { reading_time }),
        ...(author !== undefined && { author }),
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
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { error } = await admin.from('articles').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
