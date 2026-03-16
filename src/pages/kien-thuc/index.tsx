/**
 * /kien-thuc — KnowledgeHub article grid
 *
 * Two categories:
 *   - thuc-chien: Operational / tactical content (tour ops, SOP, logistics)
 *   - tri-thuc:   Strategic / knowledge content  (trends, analysis, visa)
 *
 * ISR revalidates every 60 s — new articles appear quickly without a full rebuild.
 */
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { createAdminClient } from '@/lib/supabase';
import type { ArticleRow } from '@/lib/database.types';
import { PageLayout } from '@/components/PageLayout';

type ArticleCard = Pick<
  ArticleRow,
  'id' | 'title' | 'slug' | 'excerpt' | 'cover_image_url' | 'category' | 'reading_time' | 'author' | 'created_at'
>;

interface Props {
  articles: ArticleCard[];
}

const CATEGORIES = [
  { key: 'all',        label: 'Tất cả' },
  { key: 'thuc-chien', label: 'Thực Chiến' },
  { key: 'tri-thuc',   label: 'Tri Thức' },
] as const;

const KnowledgeHub: NextPage<Props> = ({ articles }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'thuc-chien' | 'tri-thuc'>('all');

  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <PageLayout>
      <Head>
        <title>Kho Tri Thức | Câu lạc bộ Tri thức Du lịch</title>
        <meta
          name="description"
          content="Bài viết chuyên sâu về vận hành du lịch, phân tích thị trường, và tri thức ngành cho các chuyên gia."
        />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-[#1E2761] text-white py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Kho Tri Thức</h1>
            <p className="text-white/70 text-lg max-w-xl">
              Bài viết chuyên sâu, dữ liệu thực chiến — dành cho người trong ngành.
            </p>
          </div>
        </section>

        {/* Category filter */}
        <section className="border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="max-w-5xl mx-auto px-4 flex gap-1 py-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-[#1E2761] text-white'
                    : 'text-gray-500 hover:text-[#1E2761]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Article grid */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          {filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-20">Chưa có bài viết nào.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </main>
    </PageLayout>
  );
};

function ArticleCard({ article }: { article: ArticleCard }) {
  const date = new Date(article.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Link href={`/kien-thuc/${article.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-gray-50 mb-4 aspect-[16/9] relative">
        {article.cover_image_url ? (
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[#CADCFC]/30 flex items-center justify-center">
            <span className="text-[#1E2761]/30 font-serif text-3xl">CLB</span>
          </div>
        )}
        <span className={`absolute top-3 left-3 px-2 py-0.5 text-xs font-medium rounded ${
          article.category === 'thuc-chien'
            ? 'bg-[#E63946] text-white'
            : 'bg-[#1E2761] text-white'
        }`}>
          {article.category === 'thuc-chien' ? 'Thực Chiến' : 'Tri Thức'}
        </span>
      </div>
      <h2 className="font-serif text-lg leading-snug mb-2 group-hover:text-[#E63946] transition-colors line-clamp-2">
        {article.title}
      </h2>
      {article.excerpt && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>{date}</span>
        <span>·</span>
        <span>{article.reading_time} phút đọc</span>
        {article.author && (
          <>
            <span>·</span>
            <span>{article.author}</span>
          </>
        )}
      </div>
    </Link>
  );
}

const MOCK_ARTICLES: ArticleCard[] = [
  {
    id: 1,
    title: 'Quản lý allotment mùa cao điểm: Bài toán không có công thức chung',
    slug: 'quan-ly-allotment-mua-cao-diem',
    excerpt: 'Khi Tết Nguyên Đán cận kề, mỗi tour operator đều đối mặt với cùng một câu hỏi: đặt bao nhiêu phòng thì đủ mà không thừa?',
    cover_image_url: '/images/news-1.jpg',
    category: 'thuc-chien',
    reading_time: 8,
    author: 'Ban Biên Tập CLB',
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Xu hướng MICE 2025–2026: Đà Nẵng và cơ hội cho doanh nghiệp phía Nam',
    slug: 'xu-huong-mice-2025-2026',
    excerpt: 'Thị trường MICE Việt Nam đang phục hồi mạnh sau đại dịch. Đây là những gì các tour operator cần biết để không bỏ lỡ cơ hội.',
    cover_image_url: '/images/news-2.jpg',
    category: 'tri-thuc',
    reading_time: 6,
    author: 'Ban Biên Tập CLB',
    created_at: '2026-02-20T00:00:00Z',
  },
  {
    id: 3,
    title: 'Bleisure 2025: Khi ranh giới giữa công tác và du lịch dần xóa nhòa',
    slug: 'bleisure-2025',
    excerpt: 'Làn sóng "bleisure" — kết hợp business và leisure — đang định hình lại cách doanh nghiệp lữ hành thiết kế sản phẩm.',
    cover_image_url: '/images/news-3.jpg',
    category: 'tri-thuc',
    reading_time: 5,
    author: 'Ban Biên Tập CLB',
    created_at: '2026-02-10T00:00:00Z',
  },
  {
    id: 4,
    title: 'Xây dựng SOP cho tour Mekong: Kinh nghiệm từ thực địa',
    slug: 'sop-tour-mekong',
    excerpt: 'Quy trình vận hành chuẩn (SOP) không phải là bộ tài liệu để trình ký mà là công cụ sống — được dùng hàng ngày trên thực địa.',
    cover_image_url: '/images/news-4.jpg',
    category: 'thuc-chien',
    reading_time: 10,
    author: 'Ban Biên Tập CLB',
    created_at: '2026-02-01T00:00:00Z',
  },
];

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('articles')
      .select('id, title, slug, excerpt, cover_image_url, category, reading_time, author, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .returns<ArticleCard[]>();

    return {
      props: { articles: data && data.length > 0 ? data : MOCK_ARTICLES },
      revalidate: 60,
    };
  } catch {
    return {
      props: { articles: MOCK_ARTICLES },
      revalidate: 60,
    };
  }
};

export default KnowledgeHub;
