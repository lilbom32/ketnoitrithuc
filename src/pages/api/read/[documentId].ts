/**
 * /api/read/[documentId]
 *
 * Returns a short-lived Supabase Storage signed URL for online reading.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUser, hasTierAccess } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';
import type { DocumentRow } from '@/lib/database.types';

async function findAndCreateSignedUrl(
  admin: ReturnType<typeof createAdminClient>,
  filePath: string
): Promise<string | null> {
  console.log('[read] Trying path:', filePath);
  
  // Try 1: Direct path
  const { data: signedData, error } = await admin.storage
    .from('documents')
    .createSignedUrl(filePath, 3600);

  if (!error && signedData?.signedUrl) {
    console.log('[read] ✓ Success with direct path');
    return signedData.signedUrl;
  }
  console.log('[read] ✗ Direct path failed:', error?.message);

  // Try 2: List all files and find by name
  const parts = filePath.split('/');
  const filename = parts[parts.length - 1];
  const folder = parts.slice(0, -1).join('/');
  
  console.log('[read] Listing folder:', folder || '(root)');
  const { data: files, error: listError } = await admin.storage
    .from('documents')
    .list(folder || undefined);
    
  if (listError) {
    console.log('[read] List error:', listError.message);
  } else if (files && files.length > 0) {
    console.log('[read] Found', files.length, 'items');
    
    // Tìm file khớp chính xác
    const match = files.find(f => f.name === filename);
    if (match) {
      const correctPath = folder ? `${folder}/${match.name}` : match.name;
      console.log('[read] Found match:', correctPath);
      const { data } = await admin.storage.from('documents').createSignedUrl(correctPath, 3600);
      return data?.signedUrl || null;
    }
    
    // Tìm file gần giống (cùng extension, timestamp gần đúng)
    const fileExt = filename.split('.').pop();
    const filePrefix = filename.split('.')[0].slice(0, 8); // Lấy 8 ký tự đầu của timestamp
    
    const similarMatch = files.find(f => {
      const fExt = f.name.split('.').pop();
      const fPrefix = f.name.split('.')[0].slice(0, 8);
      return fExt === fileExt && fPrefix === filePrefix;
    });
    
    if (similarMatch) {
      const correctPath = folder ? `${folder}/${similarMatch.name}` : similarMatch.name;
      console.log('[read] Found similar match:', correctPath);
      const { data } = await admin.storage.from('documents').createSignedUrl(correctPath, 3600);
      return data?.signedUrl || null;
    }
  }
  
  // Try 3: Search in root if folder specified
  if (folder) {
    console.log('[read] Trying root folder...');
    const { data: rootFiles } = await admin.storage.from('documents').list();
    if (rootFiles) {
      const rootMatch = rootFiles.find(f => f.name === filename || f.name.startsWith(filename.split('.')[0]));
      if (rootMatch) {
        console.log('[read] Found in root:', rootMatch.name);
        const { data } = await admin.storage.from('documents').createSignedUrl(rootMatch.name, 3600);
        return data?.signedUrl || null;
      }
    }
  }
  
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const { documentId } = req.query as { documentId: string };
    console.log('[read] Request for documentId:', documentId);
    
    const admin = createAdminClient();
    console.log('[read] Admin client created');

    // Fetch document
    const { data: doc, error: docError } = await admin
      .from('documents')
      .select('id, file_url, read_access, published')
      .eq('id', documentId)
      .single<Pick<DocumentRow, 'id' | 'file_url' | 'read_access' | 'published'>>();

    if (docError) {
      console.error('[read] Database error:', docError.message);
      return res.status(500).json({ error: 'Database error', details: docError.message });
    }

    if (!doc?.published) {
      console.log('[read] Document not found or not published:', documentId);
      return res.status(404).json({ error: 'Document not found' });
    }

    console.log('[read] Document found:', doc.id, 'file_url:', doc.file_url, 'read_access:', doc.read_access);

    // Auth check
    let userEmail: string | null = null;
    if (doc.read_access !== 'visitor') {
      console.log('[read] Checking auth for non-visitor access');
      const profile = await getAuthUser(req, res);
      if (!profile) {
        console.log('[read] Auth required but no profile found');
        return res.status(401).json({ error: 'Authentication required', requiredTier: doc.read_access });
      }
      console.log('[read] Profile found:', profile.email, 'tier:', profile.membership_tier);
      if (!hasTierAccess(profile.membership_tier, doc.read_access)) {
        console.log('[read] Tier access denied');
        return res.status(403).json({
          error: 'Upgrade required',
          requiredTier: doc.read_access,
          currentTier: profile.membership_tier,
        });
      }
      userEmail = profile.email ?? null;
    }

    if (!doc.file_url) {
      console.log('[read] No file_url for document');
      return res.status(404).json({ error: 'File not available' });
    }

    // Generate signed URL
    console.log('[read] Generating signed URL for:', doc.file_url);
    const signedUrl = await findAndCreateSignedUrl(admin, doc.file_url);

    if (!signedUrl) {
      console.error('[read] Could not generate signed URL for:', doc.file_url);
      return res.status(500).json({ error: 'Could not generate read link' });
    }

    console.log('[read] Success - returning signed URL');
    return res.status(200).json({ url: signedUrl, userEmail });
  } catch (err: any) {
    console.error('[read] Unexpected error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error', details: err?.message });
  }
}
