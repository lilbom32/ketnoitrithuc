/**
 * /dang-ky/thanh-toan
 *
 * Payment initiation page — shown after email signup when user chooses "Professional" tier.
 * Calls /api/payment/create-vnpay and redirects to VNPay.
 */
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CreditCard, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

const ThanhToanPage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function initiatePayment() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payment/create-vnpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'premium' }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/dang-nhap?next=/dang-ky/thanh-toan');
          return;
        }
        setError(data.error ?? 'Không thể khởi tạo thanh toán.');
        setLoading(false);
        return;
      }
      // Redirect to VNPay
      window.location.href = data.paymentUrl;
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <Head>
        <title>Thanh toán Premium | Câu lạc bộ Tri thức Du lịch</title>
        <meta name="description" content="Hoàn tất thanh toán để kích hoạt gói Premium của Câu lạc bộ Tri thức Du lịch." />
      </Head>

      <section className="min-h-[calc(100vh-72px)] bg-[#F5F7FA] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-xl border border-[#CADCFC] overflow-hidden">
            {/* Header */}
            <div className="bg-[#1E2761] px-10 py-8 text-white text-center">
              <div className="inline-flex w-14 h-14 bg-white/10 rounded-2xl items-center justify-center mb-4">
                <CreditCard className="w-7 h-7 text-white/80" />
              </div>
              <h1 className="font-serif text-3xl mb-1">Nâng cấp Premium</h1>
              <p className="text-white/60 text-sm">Truy cập không giới hạn mọi tài liệu</p>
            </div>

            {/* Summary */}
            <div className="px-10 py-8">
              <div className="bg-[#F5F7FA] rounded-2xl p-6 mb-6 border border-[#CADCFC]">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-[#1E2761]">Thành viên Chuyên nghiệp</span>
                </div>
                <ul className="space-y-2">
                  {[
                    'Truy cập kho PDF không giới hạn',
                    'Ưu đãi 20% các khóa học',
                    'Thẻ thành viên điện tử',
                    'Ưu tiên đăng ký sự kiện',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {error && (
                <div className="bg-[#E63946]/5 border border-[#E63946]/20 rounded-xl px-4 py-3 text-[#E63946] text-sm mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={initiatePayment}
                disabled={loading}
                className="w-full py-4 bg-[#E63946] text-white rounded-2xl font-bold text-base hover:bg-[#E63946]/90 transition-all shadow-lg hover:shadow-[#E63946]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang chuyển đến VNPay...
                  </>
                ) : (
                  <>
                    Thanh toán qua VNPay
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <Shield className="w-3.5 h-3.5" />
                Thanh toán bảo mật qua VNPay — dữ liệu được mã hóa SSL
              </div>

              <div className="mt-6 text-center">
                <Link href="/dang-ky" className="text-sm text-gray-400 hover:text-[#1E2761] transition-colors">
                  ← Quay lại và chọn gói Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ThanhToanPage;
