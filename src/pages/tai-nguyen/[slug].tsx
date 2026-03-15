import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { Download, Lock, BookOpen, FileText, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), { ssr: false });
import { PageLayout } from '@/components/PageLayout';
import { createAdminClient } from '@/lib/supabase';
import type { DocumentRow, MembershipTier } from '@/lib/database.types';

type DocMeta = Pick<
  DocumentRow,
  'id' | 'title' | 'description' | 'category' | 'cover_url' | 'read_access' | 'download_access'
>;

interface Props {
  doc: DocMeta;
}

const TIER_LABELS: Record<MembershipTier, string> = {
  visitor: 'Miễn phí',
  free: 'Thành viên',
  premium: 'Premium',
};

const TIER_ORDER: MembershipTier[] = ['visitor', 'free', 'premium'];

type ReadState =
  | { status: 'loading' }
  | { status: 'ready'; url: string; userEmail: string | null }
  | { status: 'auth_required'; requiredTier: MembershipTier }
  | { status: 'upgrade_required'; requiredTier: MembershipTier }
  | { status: 'error'; message?: string };

const TaiNguyenDocPage: NextPage<Props> = ({ doc }) => {
  const [readState, setReadState] = useState<ReadState>({ status: 'loading' });
  const [downloading, setDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState<{ type: 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    async function fetchReadUrl() {
      try {
        const res = await fetch(`/api/read/${doc.id}`);
        if (res.ok) {
          const { url, userEmail } = await res.json();
          setReadState({ status: 'ready', url, userEmail: userEmail ?? null });
        } else if (res.status === 401) {
          const { requiredTier } = await res.json().catch(() => ({}));
          setReadState({ status: 'auth_required', requiredTier: requiredTier ?? 'free' });
        } else if (res.status === 403) {
          const { requiredTier } = await res.json().catch(() => ({}));
          setReadState({ status: 'upgrade_required', requiredTier: requiredTier ?? 'premium' });
        } else {
          const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          console.error('[tai-nguyen] API error:', res.status, errorData);
          setReadState({ status: 'error', message: errorData.error || errorData.details || `Lỗi ${res.status}` });
        }
      } catch (err: any) {
        console.error('[tai-nguyen] Fetch error:', err);
        setReadState({ status: 'error', message: err?.message || 'Không thể kết nối đến server' });
      }
    }
    fetchReadUrl();
  }, [doc.id]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    setDownloadMsg(null);
    try {
      const res = await fetch(`/api/download/${doc.id}`);
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setDownloadMsg({ type: 'info', text: 'Đăng nhập để tải tài liệu này.' });
        } else if (res.status === 429) {
          setDownloadMsg({ type: 'info', text: 'Đã đạt giới hạn tải tháng này. Nâng cấp Premium để tải không giới hạn.' });
        } else {
          setDownloadMsg({ type: 'error', text: data.error ?? 'Tải xuống thất bại.' });
        }
        return;
      }
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch {
      setDownloadMsg({ type: 'error', text: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setDownloading(false);
    }
  }, [doc.id]);

  return (
    <PageLayout>
      <Head>
        <title>{doc.title} | Thư viện Tri Thức</title>
        <meta name="description" content={doc.description ?? `Đọc tài liệu ${doc.title} tại CLB Kết nối tri thức.`} />
      </Head>

      {/* Header */}
      <section className="bg-[#1E2761] text-white py-14 px-4">
        <div className="container-custom">
          <Link
            href="/tai-nguyen"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại thư viện
          </Link>

          <div className="flex items-start gap-6">
            <div className="hidden md:flex w-20 h-20 bg-white/10 rounded-2xl items-center justify-center flex-shrink-0 border border-white/10">
              <FileText className="w-9 h-9 text-white/40" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 text-[#E63946] text-sm font-medium">
                  <BookOpen className="w-4 h-4" />
                  <span className="capitalize">{doc.category}</span>
                </span>
                <span className="text-white/20">·</span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/60 uppercase tracking-wider">
                  Đọc online: {TIER_LABELS[doc.read_access]}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/60 uppercase tracking-wider">
                  Tải về: {TIER_LABELS[doc.download_access]}
                </span>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl text-white mb-3 leading-tight">
                {doc.title}
              </h1>

              {doc.description && (
                <p className="text-white/60 text-base leading-relaxed max-w-2xl">{doc.description}</p>
              )}

              {/* Download action */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E63946] text-white rounded-xl font-medium hover:bg-[#E63946]/90 transition-all shadow-lg hover:shadow-[#E63946]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  {downloading ? 'Đang tải...' : 'Tải về'}
                </button>

                {downloadMsg && (
                  <p className="text-sm text-white/70">
                    {downloadMsg.text}
                    {downloadMsg.type === 'info' && (
                      <>
                        {' '}
                        <Link href="/dang-ky" className="text-[#E63946] hover:underline font-medium">
                          Nâng cấp →
                        </Link>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Viewer */}
      <section className="bg-[#F5F7FA] py-10 px-4 min-h-[70vh]">
        <div className="container-custom">
          {readState.status === 'loading' && (
            <div className="bg-white rounded-2xl border border-[#CADCFC] h-[640px] flex items-center justify-center shadow-sm">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-[#1E2761] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400 text-sm">Đang tải tài liệu...</p>
              </div>
            </div>
          )}

          {readState.status === 'ready' && (
            <PdfViewer
              url={readState.url}
              title={doc.title}
              watermarkText={readState.userEmail}
            />
          )}

          {(readState.status === 'auth_required' || readState.status === 'upgrade_required') && (
            <GateOverlay
              type={readState.status}
              requiredTier={
                readState.status === 'auth_required' || readState.status === 'upgrade_required'
                  ? readState.requiredTier
                  : 'free'
              }
            />
          )}

          {readState.status === 'error' && (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#CADCFC] shadow-sm">
              <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-gray-600 mb-2">Không thể tải tài liệu</h3>
              <p className="text-gray-400 text-sm mb-2">Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
              {readState.message && (
                <p className="text-red-400 text-xs font-mono bg-red-50 px-3 py-2 rounded inline-block">
                  {readState.message}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

// ─── Gate overlay ───────────────────────────────────────────────────────────

function GateOverlay({
  type,
  requiredTier,
}: {
  type: 'auth_required' | 'upgrade_required';
  requiredTier: MembershipTier;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#CADCFC] shadow-sm overflow-hidden">
      {/* Blurred preview hint */}
      <div className="h-40 bg-gradient-to-b from-[#1E2761]/5 to-[#CADCFC]/30 flex items-center justify-center">
        <div className="flex gap-1">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-4 bg-[#1E2761]/10 rounded"
              style={{ height: `${20 + Math.random() * 30}px` }}
            />
          ))}
        </div>
      </div>

      <div className="p-10 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-[#CADCFC]/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-7 h-7 text-[#1E2761]/50" />
        </div>

        {type === 'auth_required' ? (
          <>
            <h3 className="font-serif text-2xl text-[#1E2761] mb-3">Đăng nhập để đọc tài liệu</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Bạn cần có tài khoản <strong>{TIER_LABELS[requiredTier]}</strong> để xem tài liệu này
              trực tuyến.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/dang-nhap"
                className="px-6 py-3 bg-[#1E2761] text-white rounded-xl font-medium hover:bg-[#1E2761]/90 transition-all"
              >
                Đăng nhập
              </Link>
              <Link
                href="/dang-ky"
                className="px-6 py-3 bg-[#E63946] text-white rounded-xl font-medium hover:bg-[#E63946]/90 transition-all"
              >
                Đăng ký miễn phí
              </Link>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-serif text-2xl text-[#1E2761] mb-3">
              Yêu cầu gói {TIER_LABELS[requiredTier]}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Nâng cấp tài khoản để mở khóa toàn bộ thư viện tài liệu chuyên sâu.
            </p>
            <Link
              href="/dang-ky"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#E63946] text-white rounded-xl font-medium hover:bg-[#E63946]/90 transition-all shadow-lg hover:shadow-[#E63946]/20"
            >
              Nâng cấp ngay →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Data fetching ───────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from('documents').select('slug').eq('published', true);
    const paths = (data ?? []).map((d) => ({ params: { slug: d.slug } }));
    return { paths, fallback: 'blocking' };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('documents')
      .select('id, title, description, category, cover_url, read_access, download_access')
      .eq('slug', slug)
      .eq('published', true)
      .single<DocMeta>();

    if (!data) return { notFound: true };
    return { props: { doc: data }, revalidate: 300 };
  } catch {
    return { notFound: true };
  }
};

export default TaiNguyenDocPage;
