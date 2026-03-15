import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import type { DocumentRow, MembershipTier } from '@/lib/database.types';
import { Save, Globe, Eye, EyeOff, ArrowLeft, Upload, FileText, X, Ban } from 'lucide-react';
import Link from 'next/link';

type DocFormData = {
  title: string;
  slug: string;
  description: string;
  category: string;
  file_url: string;
  cover_url: string;
  read_access: MembershipTier;
  download_access: MembershipTier;
  published: boolean;
};

interface DocumentFormProps {
  initial?: Partial<DocumentRow>;
  documentId?: string;
}

// Constants for validation
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_FILE_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // Archives
  'application/zip',
  'application/x-zip-compressed',
  // Images (for cover, but allow in documents too)
  'image/jpeg',
  'image/png',
  'image/webp',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xlsx', '.xls', '.zip', '.jpg', '.jpeg', '.png', '.webp'];

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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File quá lớn (${formatFileSize(file.size)}). Giới hạn: ${formatFileSize(MAX_FILE_SIZE)}`
    };
  }

  // Check MIME type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    // Also check extension as fallback
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        valid: false,
        error: `Định dạng file không được hỗ trợ. Cho phép: ${ALLOWED_EXTENSIONS.join(', ')}`
      };
    }
  }

  return { valid: true };
}

export default function DocumentForm({ initial, documentId }: DocumentFormProps) {
  const router = useRouter();
  const isEdit = Boolean(documentId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const [form, setForm] = useState<DocFormData>({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    description: initial?.description ?? '',
    category: initial?.category ?? 'general',
    file_url: initial?.file_url ?? '',
    cover_url: initial?.cover_url ?? '',
    read_access: initial?.read_access ?? 'visitor',
    download_access: initial?.download_access ?? 'free',
    published: initial?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [slugManual, setSlugManual] = useState(isEdit);

  const set = (key: keyof DocFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Auto slug from title
  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      ...(slugManual ? {} : { slug: slugify(title) }),
    }));
  };

  const cancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'File không hợp lệ');
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // Step 1: Get signed upload URL from server (server reads httpOnly cookie)
      const folder = form.slug || slugify(form.title) || 'uploads';
      const urlRes = await fetch('/api/admin/upload-url', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // Important: send cookies
        body: JSON.stringify({ 
          filename: file.name,
          bucket: 'documents',
          folder: folder
        }),
      });

      if (!urlRes.ok) {
        if (urlRes.status === 401) {
          throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        }
        const err = await urlRes.json();
        throw new Error(err.error || 'Failed to get upload URL');
      }

      const { path, url: signedUrl } = await urlRes.json();

      // Step 2: Upload directly to Supabase Storage using the signed URL with XMLHttpRequest for progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          xhrRef.current = null;
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText || 'Unknown error'}`));
          }
        });

        xhr.addEventListener('error', () => {
          xhrRef.current = null;
          reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
          xhrRef.current = null;
          reject(new Error('Upload cancelled'));
        });

        xhr.open('PUT', signedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
        xhr.send(file);
      });

      // Success
      set('file_url', path);
      setUploadProgress(100);
    } catch (err) {
      // Don't show error if user cancelled
      if (err instanceof Error && err.message === 'Upload cancelled') {
        setUploadProgress(0);
      } else {
        console.error('[upload] Error:', err);
        setError(err instanceof Error ? err.message : 'Upload thất bại');
      }
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const save = async (publish?: boolean) => {
    if (!form.title || !form.category) {
      setError('Tiêu đề và danh mục là bắt buộc');
      return;
    }
    setSaving(true);
    setError('');

    const body = { ...form, ...(publish !== undefined && { published: publish }) };
    const url = isEdit ? `/api/admin/documents/${documentId}` : '/api/admin/documents';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error ?? 'Có lỗi xảy ra'); setSaving(false); return; }

    router.push(`/admin/documents/${data.id}`);
    setSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/admin/documents" className="hover:text-white transition flex items-center gap-1">
          <ArrowLeft size={14} /> Tài nguyên
        </Link>
        <span>/</span>
        <span className="text-white">{isEdit ? 'Chỉnh sửa' : 'Tài nguyên mới'}</span>
      </div>

      {error && (
        <div className="px-4 py-3 bg-[#E63946]/10 border border-[#E63946]/30 rounded-xl text-[#E63946] text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
        <div className="space-y-5">
          <input
            type="text"
            placeholder="Tên tài liệu..."
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-3 bg-[#1E293B] border border-white/10 rounded-xl text-xl font-serif font-bold text-white placeholder-slate-600 focus:outline-none focus:border-[#E63946]/40 transition"
          />

          {/* Slug */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm shrink-0">URL: /tai-nguyen/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => { setSlugManual(true); set('slug', e.target.value); }}
              className="flex-1 px-3 py-1.5 bg-[#1E293B] border border-white/10 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-[#E63946]/40 transition font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mô tả</label>
            <textarea
              rows={4}
              placeholder="Mô tả nội dung tài liệu..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="w-full px-4 py-3 bg-[#1E293B] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E63946]/40 transition resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              File tài liệu (PDF, DOCX...)
            </label>
            {form.file_url ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-[#1E293B] border border-green-400/20 rounded-xl">
                <FileText className="text-green-400 shrink-0" size={20} />
                <span className="text-sm text-green-400 font-mono truncate flex-1">{form.file_url}</span>
                <button onClick={() => set('file_url', '')} className="text-slate-500 hover:text-[#E63946] transition shrink-0">
                  <X size={16} />
                </button>
              </div>
            ) : uploading ? (
              <div className="px-4 py-4 bg-[#1E293B] border border-[#E63946]/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-medium">Đang upload...</span>
                  <span className="text-sm text-[#E63946] font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-[#E63946] transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <button
                  onClick={cancelUpload}
                  className="flex items-center gap-2 text-xs text-slate-400 hover:text-[#E63946] transition"
                >
                  <Ban size={12} /> Hủy upload
                </button>
              </div>
            ) : (
              <div>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept={ALLOWED_EXTENSIONS.join(',')} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-3 w-full px-4 py-8 border-2 border-dashed border-white/10 rounded-xl text-slate-400 hover:border-[#E63946]/40 hover:text-white transition disabled:opacity-50 justify-center"
                >
                  <Upload size={20} />
                  <span className="text-sm">Click để chọn file</span>
                </button>
                <p className="text-xs text-slate-500 mt-2">
                  Cho phép: {ALLOWED_EXTENSIONS.join(', ')} • Tối đa: {formatFileSize(MAX_FILE_SIZE)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Hoặc nhập đường dẫn trực tiếp:</p>
                <input
                  type="text"
                  value={form.file_url}
                  onChange={(e) => set('file_url', e.target.value)}
                  placeholder="documents/ten-file.pdf"
                  className="mt-1 w-full px-3 py-2 bg-[#1E293B] border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E63946]/40 transition font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Xuất bản</span>
              <button onClick={() => set('published', !form.published)}
                className={`flex items-center gap-1.5 text-xs font-bold uppercase px-2.5 py-1 rounded-full border transition ${
                  form.published ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-slate-700/50 text-slate-400 border-slate-600/20'
                }`}>
                {form.published ? <><Eye size={10} /> Live</> : <><EyeOff size={10} /> Draft</>}
              </button>
            </div>
            <button onClick={() => save()} disabled={saving}
              className="w-full py-2.5 bg-[#1E2761] hover:bg-[#1E2761]/80 border border-white/10 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50">
              <Save size={14} /> Lưu nháp
            </button>
            <button onClick={() => save(true)} disabled={saving}
              className="w-full py-2.5 bg-[#E63946] hover:bg-[#E63946]/90 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#E63946]/20">
              <Globe size={14} /> Xuất bản ngay
            </button>
          </div>

          {/* Category */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Danh mục</p>
            <input
              type="text"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              placeholder="general, templates, guides..."
              className="w-full px-3 py-2 bg-[#0F172A] border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E63946]/40 transition"
            />
          </div>

          {/* Access Control */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phân quyền</p>
            <div>
              <label className="block text-xs text-slate-500 mb-2">Quyền xem</label>
              {(['visitor', 'free', 'premium'] as MembershipTier[]).map((tier) => (
                <label key={tier} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                  <input type="radio" name="read_access" value={tier} checked={form.read_access === tier}
                    onChange={() => set('read_access', tier)} className="accent-[#E63946]" />
                  <span className="text-sm text-slate-300 capitalize">{tier}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">Quyền tải xuống</label>
              {(['visitor', 'free', 'premium'] as MembershipTier[]).map((tier) => (
                <label key={tier} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                  <input type="radio" name="download_access" value={tier} checked={form.download_access === tier}
                    onChange={() => set('download_access', tier)} className="accent-[#E63946]" />
                  <span className="text-sm text-slate-300 capitalize">{tier}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ảnh bìa (URL)</p>
            <input
              type="url"
              value={form.cover_url}
              onChange={(e) => set('cover_url', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-[#0F172A] border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E63946]/40 transition"
            />
            {form.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.cover_url} alt="cover" className="w-full h-24 object-cover rounded-lg border border-white/10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
