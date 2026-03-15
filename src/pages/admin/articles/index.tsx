import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { withAdminAuth } from '@/components/admin/AdminAuthGate';
import { createAdminClient } from '@/lib/supabase';
import type { ArticleRow } from '@/lib/database.types';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/router';

interface ArticlesListProps {
  articles: Pick<ArticleRow, 'id' | 'title' | 'slug' | 'category' | 'author' | 'reading_time' | 'published' | 'created_at'>[];
}

const CATEGORY_LABELS: Record<string, string> = {
  'thuc-chien': 'Thực Chiến',
  'tri-thuc': 'Tri Thức',
};

export default function ArticlesListPage({ articles: initialArticles }: ArticlesListProps) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [loading, setLoading] = useState<number | null>(null);

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.author ?? '').toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'published' && a.published) ||
      (filter === 'draft' && !a.published);
    return matchSearch && matchFilter;
  });

  const togglePublish = async (id: number, current: boolean) => {
    setLoading(id);
    const res = await fetch(`/api/admin/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    });
    if (res.ok) {
      setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, published: !current } : a)));
    }
    setLoading(null);
  };

  const deleteArticle = async (id: number, title: string) => {
    if (!confirm(`Xóa bài viết "${title}"? Hành động này không thể hoàn tác.`)) return;
    setLoading(id);
    const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
    setLoading(null);
  };

  return (
    <AdminLayout title="Bài viết">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">Bài viết</h2>
            <p className="text-slate-400 text-sm mt-0.5">{articles.length} bài viết tổng cộng</p>
          </div>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E63946] hover:bg-[#E63946]/90 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-[#E63946]/20"
          >
            <Plus size={16} /> Bài viết mới
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
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

        {/* Table */}
        <div className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-[#0F172A]/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tiêu đề</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Danh mục</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Tác giả</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Ngày</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                      Không tìm thấy bài viết nào.
                    </td>
                  </tr>
                ) : (
                  filtered.map((article) => (
                    <tr key={article.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium line-clamp-1">{article.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">/{article.slug}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs px-2 py-1 bg-[#1E2761]/50 text-[#CADCFC] border border-[#1E2761] rounded-full">
                          {CATEGORY_LABELS[article.category] ?? article.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 hidden lg:table-cell">
                        {article.author ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs hidden sm:table-cell">
                        {new Date(article.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => togglePublish(article.id, article.published)}
                          disabled={loading === article.id}
                          title={article.published ? 'Bỏ xuất bản' : 'Xuất bản'}
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border transition disabled:opacity-50 ${
                            article.published
                              ? 'bg-green-400/10 text-green-400 border-green-400/20 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20'
                              : 'bg-slate-700/50 text-slate-400 border-slate-600/20 hover:bg-green-400/10 hover:text-green-400 hover:border-green-400/20'
                          }`}
                        >
                          {article.published ? <><Eye size={10} /> Live</> : <><EyeOff size={10} /> Draft</>}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => deleteArticle(article.id, article.title)}
                            disabled={loading === article.id}
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

export const getServerSideProps = withAdminAuth<ArticlesListProps>(async () => {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('articles')
    .select('id, title, slug, category, author, reading_time, published, created_at')
    .order('created_at', { ascending: false });

  if (error) console.error(error);

  return { props: { articles: data ?? [] } };
});
