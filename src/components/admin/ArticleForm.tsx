import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import type { ArticleRow } from '@/lib/database.types';
import { Save, Globe, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

type ArticleFormData = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  category: 'thuc-chien' | 'tri-thuc';
  reading_time: number;
  author: string;
  published: boolean;
};

interface ArticleFormProps {
  initial?: Partial<ArticleRow>;
  articleId?: number;
}

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

export default function ArticleForm({ initial, articleId }: ArticleFormProps) {
  const router = useRouter();
  const isEdit = Boolean(articleId);

  const [form, setForm] = useState<ArticleFormData>({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    content: initial?.content ?? '',
    excerpt: initial?.excerpt ?? '',
    cover_image_url: initial?.cover_image_url ?? '',
    category: initial?.category ?? 'tri-thuc',
    reading_time: initial?.reading_time ?? 5,
    author: initial?.author ?? '',
    published: initial?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [slugManual, setSlugManual] = useState(isEdit);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && form.title) {
      setForm((prev) => ({ ...prev, slug: slugify(form.title) }));
    }
  }, [form.title, slugManual]);

  const set = (key: keyof ArticleFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async (publish?: boolean) => {
    if (!form.title) { setError('Tiêu đề là bắt buộc'); return; }
    setSaving(true);
    setError('');

    const body = { ...form, ...(publish !== undefined && { published: publish }) };
    const url = isEdit ? `/api/admin/articles/${articleId}` : '/api/admin/articles';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? 'Có lỗi xảy ra');
      setSaving(false);
      return;
    }

    router.push(`/admin/articles/${data.id}`);
    setSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/admin/articles" className="hover:text-white transition flex items-center gap-1">
          <ArrowLeft size={14} /> Bài viết
        </Link>
        <span>/</span>
        <span className="text-white">{isEdit ? 'Chỉnh sửa' : 'Bài viết mới'}</span>
      </div>

      {error && (
        <div className="px-4 py-3 bg-[#E63946]/10 border border-[#E63946]/30 rounded-xl text-[#E63946] text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
        {/* Main content */}
        <div className="space-y-5">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Tiêu đề bài viết..."
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="w-full px-4 py-3 bg-[#1E293B] border border-white/10 rounded-xl text-xl font-serif font-bold text-white placeholder-slate-600 focus:outline-none focus:border-[#E63946]/40 transition"
            />
          </div>

          {/* Slug */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm shrink-0">URL: /kien-thuc/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => { setSlugManual(true); set('slug', e.target.value); }}
              className="flex-1 px-3 py-1.5 bg-[#1E293B] border border-white/10 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-[#E63946]/40 transition font-mono"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Mô tả ngắn (excerpt)
            </label>
            <textarea
              rows={2}
              placeholder="1-2 câu tóm tắt bài viết..."
              value={form.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              className="w-full px-4 py-3 bg-[#1E293B] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E63946]/40 transition resize-none"
            />
          </div>

          {/* Content editor */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Nội dung (Markdown)
            </label>
            <RichTextEditor
              value={form.content}
              onChange={(v) => set('content', v)}
              height={550}
              placeholder="Nhập nội dung bài viết..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24">
          {/* Publish actions */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Xuất bản</span>
              <button
                onClick={() => set('published', !form.published)}
                className={`flex items-center gap-1.5 text-xs font-bold uppercase px-2.5 py-1 rounded-full border transition ${
                  form.published
                    ? 'bg-green-400/10 text-green-400 border-green-400/20'
                    : 'bg-slate-700/50 text-slate-400 border-slate-600/20'
                }`}
              >
                {form.published ? <><Eye size={10} /> Live</> : <><EyeOff size={10} /> Draft</>}
              </button>
            </div>
            <button
              onClick={() => save()}
              disabled={saving}
              className="w-full py-2.5 bg-[#1E2761] hover:bg-[#1E2761]/80 border border-white/10 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={14} /> Lưu nháp
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="w-full py-2.5 bg-[#E63946] hover:bg-[#E63946]/90 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#E63946]/20"
            >
              <Globe size={14} /> Xuất bản ngay
            </button>
          </div>

          {/* Category */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Danh mục</p>
            <div className="space-y-2">
              {(['thuc-chien', 'tri-thuc'] as const).map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={form.category === cat}
                    onChange={() => set('category', cat)}
                    className="accent-[#E63946]"
                  />
                  <span className="text-sm text-slate-300">
                    {cat === 'thuc-chien' ? 'Thực Chiến' : 'Tri Thức'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Metadata</p>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Tác giả</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => set('author', e.target.value)}
                placeholder="Ban Biên Tập CLB"
                className="w-full px-3 py-2 bg-[#0F172A] border border-white/10 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#E63946]/40 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Thời gian đọc (phút)</label>
              <input
                type="number"
                min={1}
                value={form.reading_time}
                onChange={(e) => set('reading_time', Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#0F172A] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#E63946]/40 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Ảnh bìa (URL)</label>
              <input
                type="url"
                value={form.cover_image_url}
                onChange={(e) => set('cover_image_url', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-[#0F172A] border border-white/10 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#E63946]/40 transition"
              />
              {form.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.cover_image_url}
                  alt="preview"
                  className="mt-2 w-full h-28 object-cover rounded-lg border border-white/10"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>
          </div>

          {isEdit && (
            <Link
              href={`/kien-thuc/${form.slug}`}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2.5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-sm rounded-xl transition"
            >
              <Eye size={14} /> Xem trên website
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
