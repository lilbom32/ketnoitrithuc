/**
 * /ve-chung-toi — Về Chúng Tôi (About)
 * Team showcase, mission/vision, trust signals.
 */
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Users, Target, Award, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

const STATS = [
  { value: '500+', label: 'Thành viên chuyên nghiệp' },
  { value: '3+', label: 'Năm hoạt động' },
  { value: '120+', label: 'Bài viết thực chiến' },
  { value: '40+', label: 'Đối tác doanh nghiệp' },
];

const BOARD_MEMBERS = [
  {
    name: 'Ban Đào Tạo',
    desc: 'Xây dựng chương trình học, khóa học nghiệp vụ và tài liệu chuẩn hóa cho ngành du lịch – khách sạn.',
    icon: BookOpen,
    href: '#ban-dao-tao',
  },
  {
    name: 'Ban Tư Vấn',
    desc: 'Kết nối chuyên gia thực chiến, tư vấn chiến lược kinh doanh và định hướng phát triển thị trường.',
    icon: Target,
    href: '#ban-tu-van',
  },
  {
    name: 'Ban Văn Hóa',
    desc: 'Duy trì giá trị cốt lõi, tổ chức hoạt động cộng đồng và xây dựng văn hóa tri thức bền vững.',
    icon: Award,
    href: '#van-hoa',
  },
];

const CULTURE_VALUES = [
  'Tri thức thực chiến — không lý thuyết suông',
  'Chia sẻ mở — kinh nghiệm là tài sản cộng đồng',
  'Chuyên nghiệp hóa ngành du lịch Việt Nam',
  'Kết nối B2B có chiều sâu, không chỉ mạng lưới',
];

const VeChungToiPage: NextPage = () => {
  return (
    <PageLayout>
      <Head>
        <title>Về Chúng Tôi | Câu lạc bộ Tri thức Du lịch</title>
        <meta
          name="description"
          content="Câu lạc bộ Tri thức Du lịch — cộng đồng B2B cho travel agents, tour operators và hospitality managers tại Việt Nam. Sứ mệnh kết nối tri thức và kiến tạo giá trị ngành."
        />
      </Head>

      {/* Hero */}
      <section className="bg-[#1E2761] text-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#E63946] text-sm font-medium tracking-widest uppercase mb-4">Về Chúng Tôi</p>
          <h1 className="font-serif text-4xl md:text-6xl mb-6 leading-tight">
            Cộng đồng tri thức<br />cho ngành du lịch Việt
          </h1>
          <p className="text-white/70 text-xl max-w-2xl leading-relaxed">
            Không phải hội nhóm mạng xã hội. Câu lạc bộ Tri thức Du lịch là nơi các chuyên gia B2B
            trao đổi kinh nghiệm thực chiến, cập nhật xu hướng và xây dựng năng lực cạnh tranh.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/dang-ky"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E63946] text-white rounded-lg font-medium hover:bg-[#E63946]/90 transition-colors"
            >
              Tham gia CLB <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-lg font-medium hover:border-white/60 transition-colors"
            >
              Xem khóa học
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#CADCFC]">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-serif text-4xl text-[#1E2761] font-bold mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#E63946] text-sm font-medium tracking-widest uppercase mb-3">Sứ Mệnh</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E2761] mb-6">
                Nâng chuẩn chuyên môn cho người làm du lịch Việt
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ngành du lịch Việt Nam đang trưởng thành nhanh. Nhưng phần lớn kiến thức vẫn phân tán
                — từng người tự mò mẫm, thiếu cộng đồng chia sẻ thực chất.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Câu lạc bộ Tri thức Du lịch ra đời để tập trung kinh nghiệm thực chiến của những người trong cuộc,
                từ tour operator đến hotel revenue manager, và biến nó thành nguồn học liệu dùng được ngay.
              </p>
            </div>
            <div className="bg-[#1E2761] rounded-2xl p-8 text-white">
              <p className="text-[#CADCFC] text-sm uppercase tracking-widest mb-4">Tầm Nhìn</p>
              <p className="font-serif text-2xl leading-relaxed mb-6">
                "Trở thành nền tảng tri thức B2B du lịch được tham chiếu nhiều nhất tại Đông Nam Á."
              </p>
              <div className="space-y-3">
                {CULTURE_VALUES.map((v) => (
                  <div key={v} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#E63946] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Org Chart */}
      <section id="so-do-to-chuc" className="bg-white py-20 px-4 scroll-mt-20">
        <div className="max-w-5xl mx-auto">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-px bg-[#E63946]" />
            <p className="text-[#E63946] text-xs font-bold tracking-[0.2em] uppercase">Sơ Đồ Tổ Chức</p>
          </div>

          {/* Level 0 — Ban Lãnh Đạo (full-width authority banner) */}
          <div className="relative bg-[#1E2761] rounded-2xl overflow-hidden mb-4 shadow-lg">
            {/* Decorative background text */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 font-serif text-[120px] leading-none text-white/[0.04] select-none pointer-events-none">
              CLB
            </div>
            {/* Red accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#E63946]" />

            <div className="px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[#E63946] text-xs font-bold tracking-widest uppercase mb-1">Cấp điều hành cao nhất</p>
                <h3 className="font-serif text-2xl text-white font-semibold">Ban Lãnh Đạo</h3>
                <p className="text-white/50 text-sm mt-1">Chủ tịch CLB &amp; Ban điều hành — định hướng chiến lược, phê duyệt chương trình hoạt động</p>
              </div>
              <div className="hidden sm:block text-right flex-shrink-0">
                <p className="text-white/20 font-serif text-5xl font-bold leading-none">01</p>
              </div>
            </div>
          </div>

          {/* Connector label */}
          <div className="flex items-center gap-3 mb-4 pl-10">
            <div className="w-px h-8 bg-[#CADCFC]" />
            <p className="text-xs text-gray-400 tracking-wider uppercase">Trực thuộc &amp; báo cáo</p>
          </div>

          {/* Level 1 — Departments */}
          <div className="grid md:grid-cols-3 gap-4">
            {BOARD_MEMBERS.map((board, idx) => {
              const Icon = board.icon;
              return (
                <div
                  key={board.name}
                  id={board.href.slice(1)}
                  className="group relative bg-[#F8F9FC] rounded-2xl p-6 border border-[#CADCFC] hover:bg-white hover:border-[#1E2761]/20 hover:shadow-xl transition-all duration-300 scroll-mt-20 overflow-hidden"
                >
                  {/* Decorative number */}
                  <span className="absolute right-5 bottom-4 font-serif text-6xl font-bold text-[#1E2761]/5 leading-none select-none pointer-events-none group-hover:text-[#1E2761]/8 transition-colors">
                    {String(idx + 2).padStart(2, '0')}
                  </span>

                  {/* Top accent bar */}
                  <div className="w-8 h-1 rounded-full bg-[#E63946]/30 group-hover:bg-[#E63946] group-hover:w-12 transition-all duration-300 mb-5" />

                  <div className="w-10 h-10 bg-[#1E2761]/8 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1E2761] transition-colors duration-300">
                    <Icon className="w-5 h-5 text-[#1E2761] group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h3 className="font-serif text-lg text-[#1E2761] mb-2 font-semibold">{board.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed relative z-10">{board.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section id="van-hoa" className="bg-[#1E2761] py-20 px-4 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#E63946] text-sm font-medium tracking-widest uppercase mb-3">Bộ Văn Hóa CLB</p>
            <h2 className="font-serif text-3xl text-white">Chúng tôi tin vào điều gì</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Học từ người đã làm', body: 'Mọi bài viết, khóa học và tài liệu đều đến từ chuyên gia đang hoạt động — không phải lý thuyết học thuật thuần túy.' },
              { title: 'Cộng đồng trước cạnh tranh', body: 'Chúng tôi tin rằng khi ngành du lịch Việt mạnh lên, mọi doanh nghiệp đều được hưởng lợi. Chia sẻ tạo ra giá trị mới.' },
              { title: 'Chất lượng hơn số lượng', body: 'Một bài phân tích sâu đáng giá hơn mười bài tin tức. Một kết nối thực chất hơn trăm lượt follow.' },
              { title: 'Tiêu chuẩn quốc tế, ngữ cảnh Việt Nam', body: 'Chúng tôi học từ thế giới và áp dụng vào thực tế thị trường Việt — không copy-paste mà là tư duy phù hợp hóa.' },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="font-serif text-lg text-white mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Users className="w-12 h-12 text-[#E63946] mx-auto mb-4" />
          <h2 className="font-serif text-3xl text-[#1E2761] mb-4">Sẵn sàng tham gia?</h2>
          <p className="text-gray-600 mb-8">
            Gia nhập cộng đồng 500+ chuyên gia du lịch. Truy cập tài liệu thực chiến, khóa học chuyên sâu và mạng lưới B2B.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dang-ky"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#E63946] text-white rounded-lg font-medium hover:bg-[#E63946]/90 transition-colors"
            >
              Đăng ký thành viên <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/doi-tac"
              className="inline-flex items-center gap-2 px-8 py-3 border border-[#1E2761] text-[#1E2761] rounded-lg font-medium hover:bg-[#1E2761] hover:text-white transition-colors"
            >
              Trở thành đối tác
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default VeChungToiPage;
