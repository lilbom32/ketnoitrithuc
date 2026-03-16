import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserPlus, CheckCircle, ShieldCheck, Zap, Award, ArrowRight, Star, Heart, Eye, EyeOff } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const DangKyPage: NextPage = () => {
  const router = useRouter();
  const [tier, setTier] = useState<'free' | 'pro' | 'partner'>('free');

  // Registration form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'free' | 'pro'>('free');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const TIERS = [
    {
      id: 'free',
      name: 'Thành viên Tự do',
      price: 'Miễn phí',
      desc: 'Dành cho cá nhân muốn bắt đầu khám phá tri thức.',
      features: ['Đọc 5 tài liệu/tháng', 'Tham gia Webinar công khai', 'Bản tin Tri thức hàng tuần'],
      color: 'bg-gray-100',
      textColor: 'text-gray-900',
      btnColor: 'bg-[#1E2761]',
    },
    {
      id: 'pro',
      name: 'Thành viên Chuyên nghiệp',
      price: '',
      desc: 'Dành cho chuyên viên muốn nâng tầm sự nghiệp.',
      features: ['Truy cập kho PDF không giới hạn', 'Ưu đãi 20% các khóa học', 'Thẻ thành viên điện tử', 'Ưu tiên đăng ký sự kiện'],
      color: 'bg-[#1E2761]',
      textColor: 'text-white',
      btnColor: 'bg-[#E63946]',
      popular: true,
    },
    {
      id: 'partner',
      name: 'Thành viên Đối tác',
      price: 'Liên hệ',
      desc: 'Dành cho doanh nghiệp và quản lý cấp cao.',
      features: ['Tất cả quyền Pro', 'Đăng tin tuyển dụng miễn phí', 'Cố vấn 1-1 hàng quý', 'Chứng nhận đối tác chiến lược'],
      color: 'bg-gold-500/10',
      textColor: 'text-[#1E2761]',
      btnColor: 'bg-gold-500',
    },
  ];

  return (
    <PageLayout>
      <Head>
        <title>Đăng ký Thành viên | Câu lạc bộ Tri thức Du lịch</title>
        <meta name="description" content="Gia nhập cộng đồng tri thức du lịch. Đăng ký thành viên để tham gia chia sẻ tri thức và kết nối với các chuyên gia ngành." />
      </Head>

      {/* Hero Section */}
      <section className="bg-white py-24 px-4">
        <div className="container-custom text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E63946]/10 text-[#E63946] rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-[#E63946]/20">
            <UserPlus className="w-4 h-4" /> Gia nhập cộng đồng
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-[#1E2761] mb-6">Đầu tư cho tri thức là kho bạc không bao giờ vơi</h1>
          <p className="text-gray-500 text-xl leading-relaxed">
            Chọn gói hội viên phù hợp với lộ trình phát triển của bạn. 
            Mọi gói đăng ký đều đóng góp vào việc xây dựng nền tảng tri thức du lịch bền vững tại Việt Nam.
          </p>
        </div>
      </section>

      {/* Pricing / Tiers */}
      <section className="bg-[#F5F7FA] py-20 px-4 -mt-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TIERS.map((t) => (
              <div 
                key={t.id} 
                className={`relative rounded-[2.5rem] p-10 flex flex-col h-full shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-[#CADCFC] ${t.color}`}
              >
                {t.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E63946] text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-xl">
                    Phổ biến nhất
                  </div>
                )}
                
                <div className={`mb-8 ${t.textColor}`}>
                  <h3 className="font-serif text-2xl mb-2">{t.name}</h3>
                  <div className="text-3xl font-bold mb-4">{t.price}</div>
                  <p className="text-sm opacity-70 leading-relaxed font-medium">{t.desc}</p>
                </div>
                
                <div className="h-px bg-current opacity-10 mb-8" />
                
                <ul className="space-y-4 mb-10 flex-1">
                  {t.features.map((f, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm font-medium ${t.textColor}`}>
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${t.popular ? 'text-[#E63946]' : 'text-current opacity-40'}`} />
                      <span className="opacity-80">{f}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${t.btnColor}`}>
                  {t.id === 'partner' ? 'Gửi yêu cầu' : 'Đăng ký ngay'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="py-24 px-4 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-3xl bg-[#F5F7FA] border border-gray-100 group hover:bg-[#1E2761] transition-all duration-500">
              <ShieldCheck className="w-10 h-10 text-[#E63946] mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-[#1E2761] mb-2 group-hover:text-white transition-colors">Bảo mật thông tin</h4>
              <p className="text-sm text-gray-500 group-hover:text-white/60 transition-colors">Dữ liệu cá nhân được bảo vệ theo tiêu chuẩn SSL cao nhất.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#F5F7FA] border border-gray-100 group hover:bg-[#1E2761] transition-all duration-500">
              <Zap className="w-10 h-10 text-gold-500 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-[#1E2761] mb-2 group-hover:text-white transition-colors">Kích hoạt tức thì</h4>
              <p className="text-sm text-gray-500 group-hover:text-white/60 transition-colors">Truy cập tài nguyên ngay sau khi hoàn tất thanh toán.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#F5F7FA] border border-gray-100 group hover:bg-[#1E2761] transition-all duration-500">
              <Award className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-[#1E2761] mb-2 group-hover:text-white transition-colors">Chứng nhận hội viên</h4>
              <p className="text-sm text-gray-500 group-hover:text-white/60 transition-colors">Tự hào là một phần của cộng đồng tri thức du lịch uy tín.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#F5F7FA] border border-gray-100 group hover:bg-[#1E2761] transition-all duration-500">
              <Heart className="w-10 h-10 text-pink-500 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-[#1E2761] mb-2 group-hover:text-white transition-colors">Hỗ trợ tận tâm</h4>
              <p className="text-sm text-gray-500 group-hover:text-white/60 transition-colors">Đội ngũ CSKH hỗ trợ 24/7 cho mọi vấn đề của hội viên.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="bg-[#1E2761] py-24 px-4 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <Star className="absolute top-1/4 left-1/4 w-40 h-40 rotate-12" />
          <Star className="absolute bottom-1/4 right-1/4 w-60 h-60 -rotate-12" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Steps */}
            <div>
              <h2 className="font-serif text-4xl mb-8">Sẵn sàng để bước vào thế giới tri thức mới?</h2>
              <div className="space-y-6 mb-12">
                {[
                  'Chọn gói thành viên phù hợp',
                  'Điền thông tin và xác thực email',
                  'Bắt đầu hành trình học tập không giới hạn',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 flex-shrink-0">
                      <span className="font-bold">{i + 1}</span>
                    </div>
                    <p className="text-white/80">{step}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-xs leading-relaxed max-w-md">
                Bằng cách đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của
                Câu lạc bộ Tri thức Du lịch.
              </p>
            </div>

            {/* Right: Live form */}
            <div className="bg-white rounded-[2.5rem] p-10 flex flex-col gap-5 text-[#1E2761] shadow-2xl scale-105">
              {success ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#1E2761] mb-2">Đăng ký thành công!</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Vui lòng kiểm tra email để xác thực tài khoản.
                    {selectedTier === 'pro' && ' Sau đó bạn sẽ được chuyển đến trang thanh toán.'}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-serif text-center">Thông tin đăng ký</h3>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (password.length < 6) {
                        setFormError('Mật khẩu phải có ít nhất 6 ký tự.');
                        return;
                      }
                      setLoading(true);
                      setFormError(null);

                      const { error: signUpError } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/`,
                          data: { full_name: fullName, membership_tier: 'free' },
                        },
                      });

                      setLoading(false);

                      if (signUpError) {
                        if (signUpError.message.toLowerCase().includes('already registered')) {
                          setFormError('Email này đã được đăng ký. Vui lòng đăng nhập.');
                        } else {
                          setFormError(signUpError.message);
                        }
                        return;
                      }

                      setSuccess(true);

                      if (selectedTier === 'pro') {
                        // Hand off to VNPay checkout after email confirmation
                        router.push('/dang-ky/thanh-toan?tier=pro');
                      }
                    }}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Họ và tên"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-5 py-3.5 bg-[#F5F7FA] border border-[#CADCFC] rounded-xl outline-none focus:ring-2 focus:ring-[#E63946]/50 transition-all font-medium text-sm"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email (xác thực)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-3.5 bg-[#F5F7FA] border border-[#CADCFC] rounded-xl outline-none focus:ring-2 focus:ring-[#E63946]/50 transition-all font-medium text-sm"
                    />
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Mật khẩu (ít nhất 6 ký tự)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-3.5 pr-12 bg-[#F5F7FA] border border-[#CADCFC] rounded-xl outline-none focus:ring-2 focus:ring-[#E63946]/50 transition-all font-medium text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E2761] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Tier selector */}
                    <div className="flex items-center gap-2 p-1 bg-[#F5F7FA] rounded-xl border border-[#CADCFC]">
                      <button
                        type="button"
                        onClick={() => setSelectedTier('free')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                          selectedTier === 'free'
                            ? 'bg-white shadow-sm ring-1 ring-[#1E2761]/10 text-[#1E2761]'
                            : 'text-gray-400 hover:text-[#1E2761]'
                        }`}
                      >
                        Free
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTier('pro')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                          selectedTier === 'pro'
                            ? 'bg-[#E63946] shadow-sm text-white'
                            : 'text-gray-400 hover:text-[#1E2761]'
                        }`}
                      >
                        Professional
                      </button>
                    </div>
                    {selectedTier === 'pro' && (
                      <p className="text-xs text-gray-400 -mt-1 px-1">
                        Gói Chuyên nghiệp — bạn sẽ được liên hệ sau khi xác thực email.
                      </p>
                    )}

                    {formError && (
                      <div className="bg-[#E63946]/5 border border-[#E63946]/20 rounded-xl px-4 py-3 text-[#E63946] text-xs">
                        {formError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#E63946] text-white rounded-2xl font-bold text-base hover:bg-[#E63946]/90 shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Đang xử lý...' : (
                        <>Bắt đầu ngay <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </form>

                  <p className="text-center text-xs text-gray-400">
                    Đã có tài khoản?{' '}
                    <Link href="/dang-nhap" className="text-[#1E2761] font-bold border-b border-[#1E2761] hover:text-[#E63946] hover:border-[#E63946] transition-colors">
                      Đăng nhập
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default DangKyPage;
