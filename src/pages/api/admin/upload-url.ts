import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';

// Parse cookies from request headers
function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth check - read httpOnly cookie from server
  const cookies = parseCookies(req.headers.cookie);
  const secret = cookies['admin_secret'];
  
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { filename, bucket = 'documents', folder = '' } = req.body;
    
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const path = `${folder ? folder + '/' : ''}${Date.now()}.${ext}`;

    const admin = createAdminClient();
    
    // Ensure bucket exists (auto-create if not)
    const { data: buckets, error: bucketError } = await admin.storage.listBuckets();
    if (bucketError) {
      console.error('[upload-url] List buckets error:', bucketError);
    }
    
    const bucketExists = buckets?.some(b => b.name === bucket) ?? false;
    
    if (!bucketExists) {
      console.log('[upload-url] Bucket not found, creating:', bucket);
      const { error: createError } = await admin.storage.createBucket(bucket, {
        public: false
      });
      
      if (createError) {
        console.error('[upload-url] Create bucket error:', createError);
        return res.status(500).json({ 
          error: `Failed to create storage bucket: ${createError.message}` 
        });
      }
      console.log('[upload-url] Bucket created successfully');
    }

    // Create signed URL for upload (valid for 60 seconds)
    const { data, error } = await admin.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) {
      console.error('[upload-url] Create signed URL error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ 
      path: data.path,
      token: data.token,
      url: data.signedUrl 
    });
  } catch (err) {
    console.error('[upload-url] Error:', err);
    return res.status(500).json({ 
      error: 'Failed to create upload URL',
      details: err instanceof Error ? err.message : String(err)
    });
  }
}
