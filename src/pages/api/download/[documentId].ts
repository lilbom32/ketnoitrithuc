/**
 * /api/download/[documentId]
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUser, hasTierAccess, DOWNLOAD_LIMITS } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';
import type { DocumentRow } from '@/lib/database.types';

async function findAndCreateSignedUrl(
  admin: ReturnType<typeof createAdminClient>,
  filePath: string,
  expiresIn: number
): Promise<string | null> {
  console.log('[download] Trying path:', filePath);
  
  // Try 1: Direct path
  const { data: signedData, error } = await admin.storage
    .from('documents')
    .createSignedUrl(filePath, expiresIn);

  if (!error && signedData?.signedUrl) {
    console.log('[download] ✓ Success with direct path');
    return signedData.signedUrl;
  }
  console.log('[download] ✗ Direct path failed:', error?.message);

  // Try 2: List and find
  const parts = filePath.split('/');
  const filename = parts[parts.length - 1];
  const folder = parts.slice(0, -1).join('/');
  
  const { data: files } = await admin.storage
    .from('documents')
    .list(folder || undefined);
    
  if (files && files.length > 0) {
    const match = files.find(f => f.name === filename);
    if (match) {
      const correctPath = folder ? `${folder}/${match.name}` : match.name;
      const { data } = await admin.storage.from('documents').createSignedUrl(correctPath, expiresIn);
      return data?.signedUrl || null;
    }
    
    // Similar match
    const fileExt = filename.split('.').pop();
    const filePrefix = filename.split('.')[0].slice(0, 8);
    
    const similarMatch = files.find(f => {
      const fExt = f.name.split('.').pop();
      const fPrefix = f.name.split('.')[0].slice(0, 8);
      return fExt === fileExt && fPrefix === filePrefix;
    });
    
    if (similarMatch) {
      const correctPath = folder ? `${folder}/${similarMatch.name}` : similarMatch.name;
      const { data } = await admin.storage.from('documents').createSignedUrl(correctPath, expiresIn);
      return data?.signedUrl || null;
    }
  }
  
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { documentId } = req.query as { documentId: string };

  // Authenticate
  const profile = await getAuthUser(req, res);
  if (!profile) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const admin = createAdminClient();

  // Fetch document
  const { data: doc, error: docError } = await admin
    .from('documents')
    .select('id, file_url, download_access, published')
    .eq('id', documentId)
    .single<Pick<DocumentRow, 'id' | 'file_url' | 'download_access' | 'published'>>();

  if (docError || !doc || !doc.published) {
    return res.status(404).json({ error: 'Document not found' });
  }

  console.log('[download] Document:', doc.id, 'file_url:', doc.file_url);

  // Tier check
  if (!hasTierAccess(profile.membership_tier, doc.download_access)) {
    return res.status(403).json({
      error: 'Upgrade required',
      requiredTier: doc.download_access,
      currentTier: profile.membership_tier,
    });
  }

  // Download limit (free tier)
  if (profile.membership_tier === 'free') {
    const resetAt = new Date(profile.downloads_reset_at);
    const now = new Date();
    if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
      await admin
        .from('profiles')
        .update({ downloads_this_month: 0, downloads_reset_at: now.toISOString() })
        .eq('id', profile.id);
      profile.downloads_this_month = 0;
    }

    if (profile.downloads_this_month >= DOWNLOAD_LIMITS.free) {
      return res.status(429).json({
        error: `Free members can download up to ${DOWNLOAD_LIMITS.free} documents per month.`,
        downloadsUsed: profile.downloads_this_month,
        limit: DOWNLOAD_LIMITS.free,
      });
    }
  }

  if (!doc.file_url) {
    return res.status(404).json({ error: 'File not available' });
  }

  // Generate signed URL
  const signedUrl = await findAndCreateSignedUrl(admin, doc.file_url, 60);

  if (!signedUrl) {
    console.error('[download] Could not generate signed URL for:', doc.file_url);
    return res.status(500).json({ error: 'Could not generate download link' });
  }

  // Log download
  await Promise.all([
    admin.from('download_logs').insert({ user_id: profile.id, document_id: doc.id }),
    admin
      .from('profiles')
      .update({ downloads_this_month: profile.downloads_this_month + 1 })
      .eq('id', profile.id),
  ]);

  return res.status(200).json({ url: signedUrl });
}
