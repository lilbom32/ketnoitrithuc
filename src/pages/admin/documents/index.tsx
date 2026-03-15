import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { withAdminAuth } from '@/components/admin/AdminAuthGate';
import { createAdminClient } from '@/lib/supabase';
import type { DocumentRow } from '@/lib/database.types';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, FileText, ExternalLink } from 'lucide-react';

interface DocsListProps {
  documents: DocumentRow[];
}

const TIER_COLORS: Record<string, string> = {
  visitor: 'bg-slate-700/50 text-slate-400 border-slate-600/20',
  free: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  premium: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
};

export default function DocumentsListPage({ documents: initialDocs }: DocsListProps) {
  const [docs, setDocs] = useState(initialDocs);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = docs.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'published' && d.published) ||
      (filter === 'draft' && !d.published);
    return matchSearch && matchFilter;
  });

  const togglePublish = async (id: string, current: boolean) => {
    setLoading(id);
    const res = await fetch(`/api/admin/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    });
    if (res.ok) setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, published: !current } : d)));
    setLoading(null);
  };

  const deleteDoc = async (id: string, title: string) => {
    if (!confirm(`Xóa tài nguyên "${title}"?`)) return;
    setLoading(id);
    const res = await fetch(`/api/admin/documents/${id}`, { method: 'DELETE' });
    if (res.ok) setDocs((prev) => prev.filter((d) => d.id !== id));
    setLoading(null);
  };

  return (
    <AdminLayout title="Tài nguyên">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">Thư viện tài nguyên</h2>
            <p className="text-slate-400 text-sm mt-0.5">{docs.length} tài liệu tổng cộng</p>
          </div>
          <Link
            href="/admin/documents/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E63946] hover:bg-[#E63946]/90 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-[#E63946]/20"
          >
            <Plus size={16} /> Tài nguyên mới
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Tìm kiếm tài nguyên..."
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
                {f === 'all' ? 'Tất cả' : f === 'published' ? 'Đã xuất bản' : 'Nháp'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-[#0F172A]/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tên tài liệu</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Danh mục</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Tải xuống</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                      Không tìm thấy tài nguyên nào.
                    </td>
                  </tr>
                ) : (
                  filtered.map((doc) => (
                    <tr key={doc.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {doc.cover_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={doc.cover_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#1E2761]/50 border border-white/10 flex items-center justify-center shrink-0">
                              <FileText size={16} className="text-[#CADCFC]" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">{doc.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">/{doc.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs text-slate-400">{doc.category}</span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${TIER_COLORS[doc.download_access] ?? ''}`}>
                          {doc.download_access}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => togglePublish(doc.id, doc.published)}
                          disabled={loading === doc.id}
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border transition disabled:opacity-50 ${
                            doc.published
                              ? 'bg-green-400/10 text-green-400 border-green-400/20 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20'
                              : 'bg-slate-700/50 text-slate-400 border-slate-600/20 hover:bg-green-400/10 hover:text-green-400 hover:border-green-400/20'
                          }`}
                        >
                          {doc.published ? <><Eye size={10} /> Live</> : <><EyeOff size={10} /> Draft</>}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {doc.published && (
                            <a
                              href={`/tai-nguyen/${doc.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#E63946] hover:bg-[#E63946]/10 transition"
                              title="Xem trên web"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                          <Link
                            href={`/admin/documents/${doc.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => deleteDoc(doc.id, doc.title)}
                            disabled={loading === doc.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#E63946] hover:bg-[#E63946]/10 transition disabled:opacity-50"
                            title="Xóa"
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

export const getServerSideProps = withAdminAuth<DocsListProps>(async () => {
  const admin = createAdminClient();
  const { data } = await admin.from('documents').select('*').order('created_at', { ascending: false });
  return { props: { documents: data ?? [] } };
});
