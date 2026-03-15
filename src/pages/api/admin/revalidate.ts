import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdminSecret } from '@/components/admin/AdminAuthGate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAdminSecret(req as any, res as any)) return;

  const { slug } = req.body as { slug?: string };

  if (!slug) {
    return res.status(400).json({ error: 'slug là bắt buộc' });
  }

  try {
    await res.revalidate('/kien-thuc');
    await res.revalidate(`/kien-thuc/${slug}`);
    return res.status(200).json({ revalidated: ['/kien-thuc', `/kien-thuc/${slug}`] });
  } catch (err) {
    return res.status(500).json({ error: 'Revalidation thất bại', detail: String(err) });
  }
}
