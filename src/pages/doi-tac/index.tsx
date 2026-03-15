import type { NextPage } from 'next';
import Head from 'next/head';
import { Handshake, MessageSquare, Briefcase, CheckCircle, ChevronRight, Globe, ShieldCheck } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

const DoiTacPage: NextPage = () => {
  const PARTNERS = [
    { name: 'Saigon Tourist', industry: 'Lữ hành', logo: 'ST' },
    { name: 'Vinpearl', industry: 'Khách sạn', logo: 'VP' },
    { name: 'Vietravel', industry: 'Lữ hành', logo: 'VT' },
    { name: 'Bamboo Airways', industry: 'Hàng không', logo: 'BA' },
    { name: 'Accor Hotels', industry: 'Khách sạn', logo: 'AH' },
    { name: 'Mekong Eco', industry: 'Du lịch sinh thái', logo: 'ME' },
  ];

  const TESTIMONIALS = [
    {
      name: 'Nguyễn Văn A',
      role: 'CEO Mekong Travel',
      content: 'CLB Kết nối tri thức đã giúp đội ngũ của chúng tôi cập nhật những xu hướng mới nhất trong quản trị du lịch bền vững. Đây thực sự là một nền tảng giá trị.',
    },
    {
      name: 'Lê Thị B',
      role: 'Quản lý Đào tạo Vinpearl',
      content: 'Các khóa học nghiệp vụ của CLB rất sát với thực tế vận hành. Nhân sự của chúng tôi cải thiện kỹ năng rõ rệt sau khi tham gia.',
    },
  ];

  return (
    <PageLayout>
      <Head>
        <title>Đối tác & Hợp tác chiến lược | CLB Kết nối tri thức</title>
        <meta name="description" content="Kết nối với mạng lưới đối tác doanh nghiệp, lữ hành và khách sạn hàng đầu. Khám phá các cơ hội hợp tác và phát triển cùng CLB Kết nối tri thức." />
      </Head>

      {/* Hero Section */}
      <section className="bg-[#1E2761] text-white py-24 px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        <div className="container-custom relative z-10 text-center max-w-4xl">
          <Handshake className="w-16 h-16 text-gold-500 mx-auto mb-8 animate-bounce-slow" />
          <h1 className="font-serif text-5xl md:text-6xl mb-6">Đồng hành cùng phát triển</h1>
          <p className="text-white/70 text-xl leading-relaxed mb-10">
            Chúng tôi tin rằng sức mạnh tri thức sẽ được nhân đôi khi có sự cộng hưởng từ các đối tác chiến lược. 
            CLB Kết nối tri thức tự hào đồng hành cùng 40+ doanh nghiệp hàng đầu trong ngành.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-10 py-4 bg-[#E63946] text-white rounded-xl font-bold hover:bg-[#E63946]/90 transition-all shadow-xl">
              Đăng ký hợp tác
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b border-[#CADCFC]">
        <div className="container-custom flex flex-wrap justify-center gap-12 md:gap-24">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E2761]">40+</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">Đối tác B2B</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E63946]/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#E63946]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E2761]">100%</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">Cam kết chất lượng</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E2761]">50+</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">Dự án thành công</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logo Wall */}
      <section id="partners" className="py-24 px-4 bg-[#F5F7FA]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl text-[#1E2761] mb-4">Các đối tác tiêu biểu</h2>
            <p className="text-gray-500">Mạng lưới kết nối các doanh nghiệp lữ hành, khách sạn và quản lý du lịch hàng đầu.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {PARTNERS.map((partner) => (
              <div key={partner.name} className="bg-white p-8 rounded-2xl border border-[#CADCFC] flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 group">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#1E2761]/5">
                  <span className="text-2xl font-serif font-bold text-gray-400 group-hover:text-[#1E2761]">{partner.logo}</span>
                </div>
                <span className="text-sm font-bold text-[#1E2761]">{partner.name}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{partner.industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-4 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl text-[#1E2761] mb-8 pr-12">Tại sao chọn đồng hành cùng CLB Kết nối tri thức?</h2>
              <div className="space-y-8">
                {[
                  { title: 'Tiếp cận cộng đồng chuyên gia', desc: 'Kết nối trực tiếp với 500+ thành viên là quản lý, chuyên viên trong ngành.' },
                  { title: 'Củng cố giá trị thương hiệu', desc: 'Xuất hiện trên các nền tảng truyền thông và học liệu của CLB.' },
                  { title: 'Ưu tiên trong các dự án đào tạo', desc: 'Được ưu tiên tham gia các chương trình đào tạo nghiệp vụ cho nhân sự.' },
                  { title: 'Dữ liệu và báo cáo chuyên sâu', desc: 'Nhận các báo cáo phân tích thị trường Mekong & Đông Nam Bộ độc quyền.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 bg-[#E63946]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-[#E63946]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1E2761] mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#1E2761] rounded-[3rem] p-12 text-white relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-500/10 rounded-full blur-2xl" />
              <h3 className="font-serif text-3xl mb-10">Testimonials</h3>
              <div className="space-y-10">
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} className="relative">
                    <MessageSquare className="absolute -left-6 -top-4 w-12 h-12 text-white/5" />
                    <p className="text-white/80 italic leading-relaxed mb-6">"{t.content}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full border border-white/20" />
                      <div>
                        <div className="font-bold">{t.name}</div>
                        <div className="text-xs text-[#CADCFC]">{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Hợp tác */}
      <section id="form" className="py-24 px-4 bg-[#F5F7FA]">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="bg-[#1E2761] p-10 text-white">
              <h2 className="font-serif text-3xl mb-4">Gửi lời ngỏ hợp tác</h2>
              <p className="text-white/60">Để lại thông tin, đội ngũ phụ trách đối tác của chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ.</p>
            </div>
            <form className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                  <input type="text" className="w-full px-4 py-3 border border-[#CADCFC] rounded-xl outline-none focus:ring-2 focus:ring-[#E63946]/50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị / Doanh nghiệp *</label>
                  <input type="text" className="w-full px-4 py-3 border border-[#CADCFC] rounded-xl outline-none focus:ring-2 focus:ring-[#E63946]/50" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email công việc *</label>
                  <input type="email" className="w-full px-4 py-3 border border-[#CADCFC] rounded-xl outline-none focus:ring-2 focus:ring-[#E63946]/50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                  <input type="tel" className="w-full px-4 py-3 border border-[#CADCFC] rounded-xl outline-none focus:ring-2 focus:ring-[#E63946]/50" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung hợp tác dự kiến</label>
                <textarea rows={4} className="w-full px-4 py-3 border border-[#CADCFC] rounded-xl outline-none focus:ring-2 focus:ring-[#E63946]/50" placeholder="VD: Tài trợ sự kiện, Đào tạo nhân sự, Nghiên cứu thị trường..."></textarea>
              </div>
              <button className="w-full py-4 bg-[#E63946] text-white rounded-xl font-bold hover:bg-[#E63946]/90 shadow-xl transition-all flex items-center justify-center gap-2">
                Gửi yêu cầu <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default DoiTacPage;
