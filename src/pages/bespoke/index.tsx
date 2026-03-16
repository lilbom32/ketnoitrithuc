import type { NextPage } from 'next';
import Head from 'next/head';
import { MapPin, CheckCircle, ArrowRight, Zap, Target, Globe } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { productConfig } from '@/config/product';

const BespokePage: NextPage = () => {
  return (
    <PageLayout>
      <Head>
        <title>Bespoke - Giải pháp Tri thức Địa phương | Câu lạc bộ Tri thức Du lịch</title>
        <meta name="description" content="Nội dung tri thức chuyên biệt cho vùng Đông Nam Bộ và Đồng bằng sông Cửu Long. Giải pháp đào tạo và nghiên cứu may đo cho doanh nghiệp địa phương." />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E2761] to-[#0A1033] text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E63946] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="container-custom relative z-10 text-center max-w-4xl">
          <span className="text-gold-500 font-bold uppercase tracking-[0.3em] text-xs mb-6 block">Tri thức chuyên biệt</span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-tight text-white">Tri thức bản địa, <br />Tâm thế toàn cầu</h1>
          <p className="text-white/70 text-xl leading-relaxed mb-10">
            Chúng tôi không tin vào một công thức chung cho tất cả.
            CLB Bespoke cung cấp các báo cáo nghiên cứu và giải pháp đào tạo
            được thiết kế riêng cho đặc thù văn hóa - kinh tế của từng vùng miền.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-10 py-4 bg-[#E63946] text-white rounded-2xl font-bold hover:bg-[#E63946]/90 transition-all shadow-2xl hover:shadow-[#E63946]/40">
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </section>

      {/* Core Regions */}
      <section className="py-24 px-4 bg-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl text-[#1E2761] mb-6">Trọng tâm nghiên cứu</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Tập trung nguồn lực vào hai đầu tàu kinh tế và du lịch phía Nam.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {productConfig.bespokeRegions.filter(r => r.id !== 'dich-vu').map((region) => (
              <div key={region.id} className="group cursor-default">
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-8 shadow-2xl">
                  <img src={region.image} alt={region.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
                    <span className="text-gold-500 font-bold uppercase tracking-widest text-xs mb-2">{region.subtitle}</span>
                    <h3 className="text-white text-4xl font-serif mb-4">{region.name}</h3>
                  </div>
                </div>
                <div className="px-4">
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">{region.description}</p>
                  <div className="grid grid-cols-2 gap-y-4">
                    {region.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-[#F5F7FA] rounded-full flex items-center justify-center border border-[#CADCFC]">
                          <CheckCircle className="w-4 h-4 text-[#E63946]" />
                        </div>
                        <span className="text-sm font-medium text-[#1E2761]">{item}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-10 flex items-center gap-2 text-[#E63946] font-bold hover:gap-4 transition-all group/btn">
                    Khám phá tài liệu vùng <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke Services */}
      <section className="bg-[#1E2761] py-24 px-4 text-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-white/10 pb-12 lg:pb-0 lg:pr-12">
              <h2 className="font-serif text-3xl mb-6">Giải pháp may đo cho doanh nghiệp</h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Ngoài các tài liệu có sẵn, chúng tôi cung cấp dịch vụ tư vấn và xây dựng nội dung theo yêu cầu riêng của đối tác.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Target, text: 'Phân tích đối thủ cạnh tranh địa phương' },
                  { icon: Zap, text: 'Xây dựng quy trình vận hành bản địa hóa' },
                  { icon: Globe, text: 'Đào tạo nhân sự theo đặc thù văn hóa vùng' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gold-500" />
                    <span className="text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 pt-12 lg:pt-0">
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-gold-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6 text-gold-500" />
                </div>
                <h4 className="text-xl font-serif mb-4">Hồ sơ địa phương (Mekong)</h4>
                <p className="text-sm text-white/50 leading-relaxed">
                  Bản đồ tri thức chi tiết cho 13 tỉnh thành ĐBSCL, từ kinh tế, nông nghiệp đến du lịch sinh thái.
                </p>
              </div>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-[#E63946]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-[#E63946]" />
                </div>
                <h4 className="text-xl font-serif mb-4">Kết nối Đông Nam Bộ</h4>
                <p className="text-sm text-white/50 leading-relaxed">
                  Mạng lưới B2B chuyên biệt cho khu vực kinh tế trọng điểm phía Nam, hỗ trợ kết nối chuỗi cung ứng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl text-[#1E2761] mb-6">Bắt đầu hành trình tri thức của bạn</h2>
            <p className="text-gray-500 mb-10">Liên hệ với đội ngũ chuyên gia của chúng tôi để được tư vấn gói nội dung phù hợp nhất với nhu cầu của bạn.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-3 bg-[#E63946] text-white rounded-xl font-bold hover:bg-[#E63946]/90 transition-all">Gửi yêu cầu Bespoke</button>
              <button className="px-8 py-3 border border-[#1E2761] text-[#1E2761] rounded-xl font-bold hover:bg-[#1E2761] hover:text-white transition-all">Tải Brochure</button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default BespokePage;
