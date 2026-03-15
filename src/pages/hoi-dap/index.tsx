import type { NextPage } from 'next';
import Head from 'next/head';
import { HelpCircle, Mail, Phone, MapPin, ChevronDown, ChevronUp, Send, MessageCircle } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { faqConfig } from '@/config/faq';
import { useState } from 'react';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'Tất cả',
  membership: 'Thành viên',
  resources: 'Tài nguyên',
  partnership: 'Đối tác',
};

const HoiDapPage: NextPage = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFaqs = faqConfig.items.filter(item => 
    selectedCategory === 'all' || item.categoryId === selectedCategory
  );

  return (
    <PageLayout>
      <Head>
        <title>Hỏi đáp & Liên hệ | CLB Kết nối tri thức</title>
        <meta name="description" content="Tìm câu trả lời cho các thắc mắc thường gặp về CLB Kết nối tri thức hoặc gửi tin nhắn trực tiếp cho ban quản trị CLB." />
      </Head>

      {/* Hero Section */}
      <section className="bg-[#1E2761] text-white py-24 px-4 relative">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5 pointer-events-none" />
        <div className="container-custom relative z-10 text-center max-w-3xl">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20">
            <HelpCircle className="w-10 h-10 text-gold-500" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl mb-6">Chúng tôi có thể giúp gì?</h1>
          <p className="text-white/70 text-xl leading-relaxed">
            Bạn có thắc mắc về các gói hội viên, tài liệu hay cơ hội hợp tác? 
            Khám phá kho câu hỏi thường gặp dưới đây hoặc liên hệ trực tiếp với chúng tôi.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-24 px-4 overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="font-serif text-3xl text-[#1E2761] mb-8">Danh mục câu hỏi</h2>
                <div className="flex flex-col gap-2">
                  {faqConfig.categories.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all text-left ${selectedCategory === cat.id ? 'bg-[#1E2761] text-white shadow-xl' : 'bg-[#F5F7FA] text-gray-500 hover:bg-[#F5F7FA]/80'}`}
                    >
                      {CATEGORY_LABELS[cat.id] ?? cat.id}
                      <ChevronDown className={`w-4 h-4 transition-transform ${selectedCategory === cat.id ? '-rotate-90' : ''}`} />
                    </button>
                  ))}
                </div>
                
                <div className="mt-12 p-8 bg-gold-500/10 rounded-3xl border border-gold-500/20 relative">
                  <MessageCircle className="w-12 h-12 text-gold-500/20 absolute -top-4 -right-4" />
                  <h4 className="font-bold text-[#1E2761] mb-2">Hỗ trợ 24/7</h4>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">Đội ngũ của chúng tôi luôn sẵn sàng giải đáp thắc mắc qua Zalo hoặc Hotline.</p>
                  <button className="text-[#E63946] font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                    Liên hệ ngay <ChevronUp className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              {filteredFaqs.map((faq) => (
                <div 
                  key={faq.id} 
                  className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 ${openId === faq.id ? 'border-[#E63946] shadow-xl' : 'border-[#CADCFC] hover:border-gray-400'}`}
                >
                  <button 
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-8 text-left outline-none"
                  >
                    <span className={`text-lg font-bold transition-colors ${openId === faq.id ? 'text-[#E63946]' : 'text-[#1E2761]'}`}>
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openId === faq.id ? 'bg-[#E63946] text-white rotate-180' : 'bg-[#F5F7FA] text-gray-400'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <div 
                    className={`transition-all duration-300 overflow-hidden ${openId === faq.id ? 'max-h-96' : 'max-h-0'}`}
                  >
                    <div className="px-8 pb-8 text-gray-500 leading-relaxed border-t border-gray-50 mx-8 pt-6">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-[#F5F7FA] py-24 px-4">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-1/3 bg-[#1E2761] p-12 text-white flex flex-col">
              <h2 className="font-serif text-3xl mb-8">Liên hệ trực tiếp</h2>
              <div className="space-y-8 flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/50 mb-1 font-bold">Email</div>
                    <div className="text-sm font-medium">contact@clbtrithuc.vn</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/50 mb-1 font-bold">Số điện thoại</div>
                    <div className="text-sm font-medium">028 38 22 88 55</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/50 mb-1 font-bold">Địa chỉ</div>
                    <div className="text-sm font-medium leading-relaxed">Quận 1, Thành phố Hồ Chí Minh</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 flex gap-4">
                {['fb', 'ln', 'yt'].map(social => (
                  <div key={social} className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#E63946] transition-all cursor-pointer">
                    <span className="text-xs font-bold uppercase">{social}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 p-12">
              <h3 className="text-2xl font-serif text-[#1E2761] mb-8">Gửi tin nhắn cho chúng tôi</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Họ tên *</label>
                    <input type="text" className="w-full px-0 py-3 border-b border-[#CADCFC] outline-none focus:border-[#E63946] transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email *</label>
                    <input type="email" className="w-full px-0 py-3 border-b border-[#CADCFC] outline-none focus:border-[#E63946] transition-all font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chủ đề</label>
                  <select className="w-full px-0 py-3 border-b border-[#CADCFC] outline-none focus:border-[#E63946] transition-all font-medium appearance-none">
                    <option>Hỏi về gói hội viên</option>
                    <option>Hợp tác đào tạo</option>
                    <option>Báo cáo sự cố</option>
                    <option>Hợp tác Bespoke</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nội dung tin nhắn *</label>
                  <textarea rows={4} className="w-full px-0 py-3 border-b border-[#CADCFC] outline-none focus:border-[#E63946] transition-all font-medium resize-none"></textarea>
                </div>
                <button className="flex items-center gap-2 bg-[#E63946] text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-[#E63946]/90 transition-all mt-8">
                  Gửi tin nhắn <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HoiDapPage;
