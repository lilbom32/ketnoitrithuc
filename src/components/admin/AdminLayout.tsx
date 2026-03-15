import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  FolderOpen,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/articles', label: 'Bài viết', icon: FileText },
  { href: '/admin/jobs', label: 'Việc làm', icon: Briefcase },
  { href: '/admin/documents', label: 'Tài nguyên', icon: FolderOpen },
  { href: '/admin/members', label: 'Thành viên', icon: Users },
];

export default function AdminLayout({ children, title = 'Admin' }: AdminLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return router.pathname === href;
    return router.pathname.startsWith(href);
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-[#1E2761] text-white w-64 shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">CLB Kết nối tri thức</p>
        <p className="text-lg font-serif font-bold text-white">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#E63946] text-white shadow-lg shadow-[#E63946]/20'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
                  {label}
                  {active && <ChevronRight className="ml-auto w-4 h-4 opacity-60" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <Head>
        <title>{title} | CLB Kết nối tri thức Admin</title>
      </Head>

      <div className="min-h-screen bg-[#0F172A] text-slate-200 flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex flex-col sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative z-10 flex flex-col h-full">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur border-b border-white/5 px-4 lg:px-8 py-4 flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base font-semibold text-white">{title}</h1>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Admin
              </span>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap');
        .font-serif { font-family: 'Libre Baskerville', serif; }
      `}</style>
    </>
  );
}
