import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';
import { requireAdminSecret } from '@/components/admin/AdminAuthGate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminSecret(req as any, res as any)) return;

  const admin = createAdminClient();

  if (req.method === 'GET') {
    const { data, error } = await admin
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { title, company, location, type, description, salary_range, contact_email, published } =
      req.body as Record<string, unknown>;

    if (!title || !company) {
      return res.status(400).json({ error: 'title và company là bắt buộc' });
    }

    const { data, error } = await admin
      .from('jobs')
      .insert({
        title,
        company,
        location: location ?? null,
        type: type ?? 'full-time',
        description: description ?? null,
        salary_range: salary_range ?? null,
        contact_email: contact_email ?? null,
        published: published ?? false,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
