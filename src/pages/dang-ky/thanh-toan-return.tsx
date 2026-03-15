/**
 * /dang-ky/thanh-toan-return
 *
 * VNPay return URL — the browser lands here after VNPay payment (success or failure).
 * We verify the vnp_ResponseCode and display the result.
 * The actual tier upgrade is handled server-side by /api/webhooks/vnpay (IPN).
 */
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

type Status = 'success' | 'pending' | 'failed';

interface Props {
  status: Status;
  responseCode: string;
}

const MESSAGES: Record<Status, { icon: React.ReactNode; title: string; desc: string }> = {
  success: {
    icon: <CheckCircle className="w-16 h-16 text-green-500" />,
    title: 'Thanh toán thành công!',
    desc: 'Tài khoản của bạn đang được nâng cấp lên Premium. Vui lòng đăng nhập lại sau vài phút.',
  },
  pending: {
    icon: <Clock className="w-16 h-16 text-amber-500" />,
    title: 'Đang xử lý',
    desc: 'Thanh toán của bạn đang được xử lý. Chúng tôi sẽ thông báo khi hoàn tất.',
  },
  failed: {
    icon: <XCircle className="w-16 h-16 text-[#E63946]" />,
    title: 'Thanh toán thất bại',
    desc: 'Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.',
  },
};

const ThanhToanReturnPage: NextPage<Props> = ({ status }) => {
  const msg = MESSAGES[status];

  return (
    <PageLayout>
      <Head>
        <title>
          {status === 'success' ? 'Thanh toán thành công' : 'Kết quả thanh toán'} | CLB Kết nối tri thức
        </title>
      </Head>

      <section className="min-h-[calc(100vh-72px)] bg-[#F5F7FA] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-[#CADCFC] p-12 text-center">
            <div className="flex justify-center mb-6">{msg.icon}</div>
            <h1 className="font-serif text-3xl text-[#1E2761] mb-3">{msg.title}</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">{msg.desc}</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/tai-nguyen"
                className="px-6 py-3 bg-[#1E2761] text-white rounded-xl font-medium hover:bg-[#1E2761]/90 transition-all text-sm"
              >
                Khám phá thư viện
              </Link>
              {status === 'failed' && (
                <Link
                  href="/dang-ky/thanh-toan"
                  className="px-6 py-3 bg-[#E63946] text-white rounded-xl font-medium hover:bg-[#E63946]/90 transition-all text-sm"
                >
                  Thử lại
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const responseCode = (query.vnp_ResponseCode as string) ?? '';

  let status: Status;
  if (responseCode === '00') {
    status = 'success';
  } else if (responseCode === '24') {
    // User cancelled
    status = 'failed';
  } else if (responseCode === '') {
    // Direct navigation (no VNPay params)
    status = 'pending';
  } else {
    status = 'failed';
  }

  return { props: { status, responseCode } };
};

export default ThanhToanReturnPage;
