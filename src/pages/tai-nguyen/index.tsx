import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, Download, Lock, FileText, Search } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { createAdminClient } from '@/lib/supabase';
import type { DocumentRow } from '@/lib/database.types';
import { useState } from 'react';

interface TaiNguyenPageProps {
  documents: Pick<DocumentRow, 'id' | 'title' | 'slug' | 'description' | 'category' | 'cover_url' | 'download_access' | 'read_access'>[];
  categories: string[];
}

const ACCESS_LABEL: Record<string, string> = {
  visitor: 'Miễn phí',
  free: 'Thành viên',
  premium: 'Premium',
};

const ACCESS_COLOR: Record<string, string> = {
  visitor: 'bg-green-500/10 text-green-600 border-green-500/20',
  free: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  premium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
};

const TaiNguyenPage: NextPage<TaiNguyenPageProps> = ({ documents, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout>
      <Head>
        <title>Thư viện số & Tài nguyên | CLB Kết nối tri thức</title>
        <meta
          name="description"
          content="Khám phá kho tài liệu số, ebook, báo cáo nghiên cứu và học liệu chuyên sâu cho ngành du lịch và khách sạn."
        />
      </Head>

      {/* Hero */}
      <section className="bg-[#1E2761] text-white py-20 px-4">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl mb-6 text-white">Thư viện số Tri thức</h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Truy cập hàng trăm tài liệu chuyên sâu, báo cáo thị trường và học liệu được biên soạn
              bởi các chuyên gia hàng đầu. Kiến thức thực chiến dành riêng cho cộng đồng du lịch.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="bg-white border-b border-[#CADCFC] py-8 sticky top-[72px] z-30 shadow-sm">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E63946] focus:border-transparent transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-[#E63946] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap capitalize ${
                    selectedCategory === cat
                      ? 'bg-[#E63946] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="bg-[#F5F7FA] py-16 px-4">
        <div className="container-custom">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl text-gray-600 font-serif">Không tìm thấy tài liệu phù hợp</h3>
              <p className="text-gray-400">Vui lòng thử lại với từ khóa khác.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#CADCFC] hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-[16/9] relative bg-gray-100 overflow-hidden">
                    {doc.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={doc.cover_url}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-16 h-16 text-[#CADCFC]" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-full border backdrop-blur-sm ${ACCESS_COLOR[doc.download_access] ?? ''}`}>
                        {ACCESS_LABEL[doc.download_access] ?? doc.download_access}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[#E63946] text-sm font-medium mb-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="capitalize">{doc.category}</span>
                    </div>
                    <h3 className="font-serif text-xl text-[#1E2761] mb-3 group-hover:text-[#E63946] transition-colors line-clamp-2">
                      {doc.title}
                    </h3>
                    {doc.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <Link
                        href={`/tai-nguyen/${doc.slug}`}
                        className="text-sm text-[#1E2761] font-medium hover:text-[#E63946] transition-colors"
                      >
                        Đọc online →
                      </Link>
                      <Link
                        href={`/tai-nguyen/${doc.slug}`}
                        className="flex items-center gap-2 bg-[#E63946] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E63946]/90 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Tải về
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="container-custom">
          <div className="bg-[#1E2761] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E63946]/20 text-[#E63946] rounded-full text-xs font-medium mb-4 border border-[#E63946]/30">
                  <Lock className="w-3 h-3" />
                  Gói Hội Viên Premium
                </div>
                <h2 className="font-serif text-3xl md:text-4xl mb-4">Mở khóa toàn bộ thư viện</h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  Đăng ký thành viên để nhận quyền truy cập không giới hạn vào tất cả tài liệu,
                  báo cáo độc quyền và học liệu chuyên sâu của CLB Kết nối tri thức.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dang-ky"
                  className="px-8 py-3 bg-[#E63946] text-white rounded-xl font-medium hover:bg-[#E63946]/90 transition-all shadow-lg hover:shadow-[#E63946]/30 text-center"
                >
                  Đăng ký ngay
                </Link>
                <Link
                  href="/ve-chung-toi"
                  className="px-8 py-3 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-all text-center"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps<TaiNguyenPageProps> = async () => {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('documents')
      .select('id, title, slug, description, category, cover_url, download_access, read_access')
      .eq('published', true)
      .order('created_at', { ascending: false });

    const documents = data ?? [];
    const categories = [...new Set(documents.map((d) => d.category))].filter(Boolean);

    return { props: { documents, categories }, revalidate: 60 };
  } catch {
    return { props: { documents: [], categories: [] }, revalidate: 30 };
  }
};

export default TaiNguyenPage;
