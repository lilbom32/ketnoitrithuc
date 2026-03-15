import { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import type { JobRow } from '@/lib/database.types';
import { Save, Globe, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

type JobFormData = {
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'freelance';
  description: string;
  salary_range: string;
  contact_email: string;
  published: boolean;
};

interface JobFormProps {
  initial?: Partial<JobRow>;
  jobId?: number;
}

export default function JobForm({ initial, jobId }: JobFormProps) {
  const router = useRouter();
  const isEdit = Boolean(jobId);

  const [form, setForm] = useState<JobFormData>({
    title: initial?.title ?? '',
    company: initial?.company ?? '',
    location: initial?.location ?? '',
    type: initial?.type ?? 'full-time',
    description: initial?.description ?? '',
    salary_range: initial?.salary_range ?? '',
    contact_email: initial?.contact_email ?? '',
    published: initial?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof JobFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async (publish?: boolean) => {
    if (!form.title || !form.company) {
      setError('Tiêu đề và tên công ty là bắt buộc');
      return;
    }
    setSaving(true);
    setError('');

    const body = { ...form, ...(publish !== undefined && { published: publish }) };
    const url = isEdit ? `/api/admin/jobs/${jobId}` : '/api/admin/jobs';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error ?? 'Có lỗi xảy ra'); setSaving(false); return; }

    router.push(`/admin/jobs/${data.id}`);
    setSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/admin/jobs" className="hover:text-white transition flex items-center gap-1">
          <ArrowLeft size={14} /> Việc làm
        </Link>
        <span>/</span>
        <span className="text-white">{isEdit ? 'Chỉnh sửa' : 'Tin mới'}</span>
      </div>

      {error && (
        <div className="px-4 py-3 bg-[#E63946]/10 border border-[#E63946]/30 rounded-xl text-[#E63946] text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_260px] gap-6 items-start">
        <div className="space-y-5">
          <input
            type="text"
            placeholder="Vị trí tuyển dụng..."
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="w-full px-4 py-3 bg-[#1E293B] border border-white/10 rounded-xl text-xl font-serif font-bold text-white placeholder-slate-600 focus:outline-none focus:border-[#E63946]/40 transition"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Tên công ty *</label>
              <input type="text" value={form.company} onChange={(e) => set('company', e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1E293B] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E63946]/40 transition" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Địa điểm</label>
              <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)}
                placeholder="Hà Nội, TP.HCM..."
                className="w-full px-3 py-2.5 bg-[#1E293B] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E63946]/40 transition" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Mức lương</label>
              <input type="text" value={form.salary_range} onChange={(e) => set('salary_range', e.target.value)}
                placeholder="15-25 triệu VNĐ"
                className="w-full px-3 py-2.5 bg-[#1E293B] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E63946]/40 transition" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Email liên hệ</label>
              <input type="email" value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)}
                placeholder="hr@company.com"
                className="w-full px-3 py-2.5 bg-[#1E293B] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E63946]/40 transition" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mô tả công việc</label>
            <RichTextEditor value={form.description} onChange={(v) => set('description', v)} height={450} placeholder="Mô tả chi tiết vị trí..." />
          </div>
        </div>

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
              <Globe size={14} /> Đăng ngay
            </button>
          </div>

          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Loại hình</p>
            {(['full-time', 'part-time', 'freelance'] as const).map((t) => (
              <label key={t} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="type" value={t} checked={form.type === t} onChange={() => set('type', t)} className="accent-[#E63946]" />
                <span className="text-sm text-slate-300">
                  {t === 'full-time' ? 'Toàn thời gian' : t === 'part-time' ? 'Bán thời gian' : 'Freelance'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
