import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { withAdminAuth } from '@/components/admin/AdminAuthGate';
import { createAdminClient } from '@/lib/supabase';
import type { JobRow } from '@/lib/database.types';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

interface JobsListProps {
  jobs: JobRow[];
}

const JOB_TYPE_LABELS: Record<string, string> = {
  'full-time': 'Toàn thời gian',
  'part-time': 'Bán thời gian',
  'freelance': 'Freelance',
};

export default function JobsListPage({ jobs: initialJobs }: JobsListProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [loading, setLoading] = useState<number | null>(null);

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'published' && j.published) ||
      (filter === 'draft' && !j.published);
    return matchSearch && matchFilter;
  });

  const togglePublish = async (id: number, current: boolean) => {
    setLoading(id);
    const res = await fetch(`/api/admin/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    });
    if (res.ok) setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, published: !current } : j)));
    setLoading(null);
  };

  const deleteJob = async (id: number, title: string) => {
    if (!confirm(`Xóa tin tuyển dụng "${title}"?`)) return;
    setLoading(id);
    const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
    if (res.ok) setJobs((prev) => prev.filter((j) => j.id !== id));
    setLoading(null);
  };

  return (
    <AdminLayout title="Việc làm">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">Tin tuyển dụng</h2>
            <p className="text-slate-400 text-sm mt-0.5">{jobs.length} tin tổng cộng</p>
          </div>
          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E63946] hover:bg-[#E63946]/90 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-[#E63946]/20"
          >
            <Plus size={16} /> Tin mới
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Tìm kiếm việc làm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#1E293B] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E63946]/40 transition"
            />
          </div>
          <div className="flex gap-1 bg-[#1E293B] border border-white/10 rounded-xl p-1">
            {(['all', 'published', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filter === f ? 'bg-[#E63946] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f === 'all' ? 'Tất cả' : f === 'published' ? 'Đang đăng' : 'Nháp'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-[#0F172A]/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vị trí</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Loại</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Mức lương</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Ngày</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                      Không tìm thấy tin nào.
                    </td>
                  </tr>
                ) : (
                  filtered.map((job) => (
                    <tr key={job.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{job.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{job.company} {job.location ? `· ${job.location}` : ''}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs px-2 py-1 bg-violet-400/10 text-violet-300 border border-violet-400/20 rounded-full">
                          {JOB_TYPE_LABELS[job.type] ?? job.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell">
                        {job.salary_range ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs hidden sm:table-cell">
                        {new Date(job.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => togglePublish(job.id, job.published)}
                          disabled={loading === job.id}
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border transition disabled:opacity-50 ${
                            job.published
                              ? 'bg-green-400/10 text-green-400 border-green-400/20 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20'
                              : 'bg-slate-700/50 text-slate-400 border-slate-600/20 hover:bg-green-400/10 hover:text-green-400 hover:border-green-400/20'
                          }`}
                        >
                          {job.published ? <><Eye size={10} /> Live</> : <><EyeOff size={10} /> Draft</>}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/jobs/${job.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => deleteJob(job.id, job.title)}
                            disabled={loading === job.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#E63946] hover:bg-[#E63946]/10 transition disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = withAdminAuth<JobsListProps>(async () => {
  const admin = createAdminClient();
  const { data } = await admin.from('jobs').select('*').order('created_at', { ascending: false });
  return { props: { jobs: data ?? [] } };
});
