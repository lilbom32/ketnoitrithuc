import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Shield, Eye, EyeOff } from 'lucide-react';
import type { GetServerSideProps } from 'next';

export default function AdminLoginPage() {
  const router = useRouter();
  const next = (router.query.next as string) || '/admin';
  const [secret, setSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret) return;
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    });

    if (res.ok) {
      router.push(next);
    } else {
      setError('Secret không đúng. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login | Câu lạc bộ Tri thức Du lịch</title>
      </Head>
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1E2761] border border-white/10 mb-4 shadow-xl">
              <Shield className="w-8 h-8 text-[#E63946]" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">Câu lạc bộ Tri thức Du lịch</h1>
            <p className="text-slate-400 text-sm mt-1">Admin Panel — Đăng nhập</p>
          </div>

          {/* Card */}
          <div className="bg-[#1E293B] rounded-2xl border border-white/10 p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Secret
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Nhập admin secret..."
                    autoFocus
                    className="w-full px-4 py-3 pr-11 bg-[#0F172A] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#E63946]/50 focus:ring-1 focus:ring-[#E63946]/20 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-[#E63946] text-sm bg-[#E63946]/10 border border-[#E63946]/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !secret}
                className="w-full py-3 bg-[#E63946] hover:bg-[#E63946]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#E63946]/20 text-sm"
              >
                {loading ? 'Đang xác thực...' : 'Vào Admin Panel'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            Câu lạc bộ Tri thức Du lịch — Nội bộ
          </p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap');
        .font-serif { font-family: 'Libre Baskerville', serif; }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // If already logged in, redirect to admin
  const secret = ctx.req.cookies['admin_secret'];
  if (process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET) {
    return { redirect: { destination: '/admin', permanent: false } };
  }
  return { props: {} };
};
