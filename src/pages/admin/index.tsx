import AdminLayout from '@/components/admin/AdminLayout';
import { withAdminAuth } from '@/components/admin/AdminAuthGate';
import { createAdminClient } from '@/lib/supabase';
import Link from 'next/link';
import { FileText, Briefcase, FolderOpen, Users, Plus, ArrowRight } from 'lucide-react';

interface DashboardProps {
  stats: {
    articles: number;
    publishedArticles: number;
    jobs: number;
    documents: number;
    members: number;
  };
  recentArticles: { id: number; title: string; published: boolean; created_at: string }[];
  recentJobs: { id: number; title: string; company: string; published: boolean }[];
}

export default function AdminDashboard({ stats, recentArticles, recentJobs }: DashboardProps) {
  const statCards = [
    {
      label: 'Bài viết',
      value: stats.articles,
      sub: `${stats.publishedArticles} đã xuất bản`,
      icon: FileText,
      href: '/admin/articles',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Việc làm',
      value: stats.jobs,
      sub: 'tin tuyển dụng',
      icon: Briefcase,
      href: '/admin/jobs',
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
    },
    {
      label: 'Tài nguyên',
      value: stats.documents,
      sub: 'tài liệu',
      icon: FolderOpen,
      href: '/admin/documents',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Thành viên',
      value: stats.members,
      sub: 'đã đăng ký',
      icon: Users,
      href: '/admin/members',
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-white mb-1">Xin chào!</h2>
          <p className="text-slate-400 text-sm">Quản lý nội dung website Câu lạc bộ Tri thức Du lịch.</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E63946] hover:bg-[#E63946]/90 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-[#E63946]/20"
          >
            <Plus size={16} /> Bài viết mới
          </Link>
          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E2761] hover:bg-[#1E2761]/90 text-white text-sm font-semibold rounded-xl border border-white/10 transition"
          >
            <Plus size={16} /> Việc làm mới
          </Link>
          <Link
            href="/admin/documents/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E2761] hover:bg-[#1E2761]/90 text-white text-sm font-semibold rounded-xl border border-white/10 transition"
          >
            <Plus size={16} /> Tài nguyên mới
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, sub, icon: Icon, href, color, bg }) => (
            <Link
              key={label}
              href={href}
              className="group bg-[#1E293B] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bg} mb-4`}>
                <Icon className={color} size={20} />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm font-medium text-white/80 mt-0.5">{label}</p>
              <p className="text-xs text-slate-500 mt-1">{sub}</p>
            </Link>
          ))}
        </div>

        {/* Recent content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Articles */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h3 className="font-semibold text-white text-sm">Bài viết gần đây</h3>
              <Link
                href="/admin/articles"
                className="text-xs text-[#E63946] hover:underline flex items-center gap-1"
              >
                Xem tất cả <ArrowRight size={12} />
              </Link>
            </div>
            <ul className="divide-y divide-white/5">
              {recentArticles.length === 0 ? (
                <li className="px-5 py-8 text-center text-slate-500 text-sm">Chưa có bài viết</li>
              ) : (
                recentArticles.map((a) => (
                  <li key={a.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition">
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{a.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(a.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          a.published
                            ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                            : 'bg-slate-700/50 text-slate-400 border border-slate-600/20'
                        }`}
                      >
                        {a.published ? 'Live' : 'Draft'}
                      </span>
                      <Link href={`/admin/articles/${a.id}`} className="text-xs text-[#E63946] hover:underline">
                        Sửa
                      </Link>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Recent Jobs */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h3 className="font-semibold text-white text-sm">Việc làm gần đây</h3>
              <Link
                href="/admin/jobs"
                className="text-xs text-[#E63946] hover:underline flex items-center gap-1"
              >
                Xem tất cả <ArrowRight size={12} />
              </Link>
            </div>
            <ul className="divide-y divide-white/5">
              {recentJobs.length === 0 ? (
                <li className="px-5 py-8 text-center text-slate-500 text-sm">Chưa có tin tuyển dụng</li>
              ) : (
                recentJobs.map((j) => (
                  <li key={j.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition">
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{j.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{j.company}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          j.published
                            ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                            : 'bg-slate-700/50 text-slate-400 border border-slate-600/20'
                        }`}
                      >
                        {j.published ? 'Live' : 'Draft'}
                      </span>
                      <Link href={`/admin/jobs/${j.id}`} className="text-xs text-[#E63946] hover:underline">
                        Sửa
                      </Link>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = withAdminAuth<DashboardProps>(async () => {
  const admin = createAdminClient();

  const [
    { count: totalArticles },
    { count: publishedArticles },
    { count: totalJobs },
    { count: totalDocs },
    { count: totalMembers },
    { data: recentArticles },
    { data: recentJobs },
  ] = await Promise.all([
    admin.from('articles').select('id', { count: 'exact', head: true }),
    admin.from('articles').select('id', { count: 'exact', head: true }).eq('published', true),
    admin.from('jobs').select('id', { count: 'exact', head: true }),
    admin.from('documents').select('id', { count: 'exact', head: true }),
    admin.from('profiles').select('id', { count: 'exact', head: true }),
    admin
      .from('articles')
      .select('id, title, published, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    admin
      .from('jobs')
      .select('id, title, company, published')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return {
    props: {
      stats: {
        articles: totalArticles ?? 0,
        publishedArticles: publishedArticles ?? 0,
        jobs: totalJobs ?? 0,
        documents: totalDocs ?? 0,
        members: totalMembers ?? 0,
      },
      recentArticles: recentArticles ?? [],
      recentJobs: recentJobs ?? [],
    },
  };
});
