import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { supabase } from '@/lib/supabase';

const DangNhapPage: NextPage = () => {
  const router = useRouter();
  const nextPath = (router.query.next as string) ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(
        authError.message.includes('Invalid login credentials')
          ? 'Email hoặc mật khẩu không đúng.'
          : authError.message,
      );
      setLoading(false);
      return;
    }

    router.push(nextPath);
  }

  return (
    <PageLayout>
      <Head>
        <title>Đăng nhập | Câu lạc bộ Tri thức Du lịch</title>
        <meta name="description" content="Đăng nhập vào Câu lạc bộ Tri thức Du lịch để truy cập thư viện tài liệu và nội dung độc quyền." />
      </Head>

      <section className="min-h-[calc(100vh-72px)] bg-[#F5F7FA] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-[#CADCFC] p-10">
            <div className="text-center mb-8">
              <div className="inline-flex w-14 h-14 bg-[#1E2761]/5 rounded-2xl items-center justify-center mb-4">
                <LogIn className="w-7 h-7 text-[#1E2761]" />
              </div>
              <h1 className="font-serif text-3xl text-[#1E2761] mb-2">Đăng nhập</h1>
              <p className="text-gray-400 text-sm">Chào mừng trở lại, Câu lạc bộ Tri thức Du lịch</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E2761] mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#CADCFC] rounded-xl outline-none focus:ring-2 focus:ring-[#E63946]/40 focus:border-[#E63946] transition-all text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#1E2761]">Mật khẩu</label>
                  <button
                    type="button"
                    className="text-xs text-[#E63946] hover:underline"
                    onClick={() => alert('Tính năng quên mật khẩu sẽ sớm ra mắt.')}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu của bạn"
                    className="w-full px-4 py-3 pr-11 bg-[#F5F7FA] border border-[#CADCFC] rounded-xl outline-none focus:ring-2 focus:ring-[#E63946]/40 focus:border-[#E63946] transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E2761] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-[#E63946]/5 border border-[#E63946]/20 rounded-xl px-4 py-3 text-[#E63946] text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#1E2761] text-white rounded-xl font-semibold hover:bg-[#1E2761]/90 transition-all shadow-lg hover:shadow-[#1E2761]/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
              Chưa có tài khoản?{' '}
              <Link href="/dang-ky" className="text-[#1E2761] font-semibold hover:text-[#E63946] transition-colors">
                Đăng ký miễn phí
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default DangNhapPage;
