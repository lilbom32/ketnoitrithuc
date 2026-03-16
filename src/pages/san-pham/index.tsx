import type { NextPage } from 'next';
import Head from 'next/head';
import { GraduationCap, Clock, Award, Users, ChevronRight, PlayCircle, Star } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { productConfig } from '@/config/product';
import Link from 'next/link';

const SanPhamPage: NextPage = () => {
  return (
    <PageLayout>
      <Head>
        <title>Sản phẩm & Khóa học | Câu lạc bộ Tri thức Du lịch</title>
        <meta name="description" content="Khám phá các khóa học nghiệp vụ, học thuật và các chương trình đào tạo chuyên sâu dành cho ngành du lịch & khách sạn." />
      </Head>

      {/* Hero Section */}
      <section className="bg-[#1E2761] text-white py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-gold-500 to-transparent" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="text-gold-500 font-medium tracking-[0.2em] uppercase mb-4 block">Học tập & Phát triển</span>
            <h1 className="font-serif text-4xl md:text-6xl mb-6 leading-tight">Nâng tầm năng lực<br />với chuyên gia thực chiến</h1>
            <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-2xl">
              Các khóa học và Masterclass được thiết kế dựa trên thực tiễn thị trường Việt Nam, 
              giúp bạn rút ngắn khoảng cách từ lý thuyết đến thành công.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#khoa-hoc" className="px-8 py-3 bg-[#E63946] text-white rounded-xl font-medium hover:bg-[#E63946]/90 transition-all shadow-lg hover:shadow-[#E63946]/30">
                Xem khóa học
              </Link>
              <Link href="/bespoke" className="px-8 py-3 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-all">
                Tìm hiểu Bespoke
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories / Stats */}
      <section className="bg-white py-12 border-b border-[#CADCFC]">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:border-r border-gray-100">
              <div className="text-3xl font-bold text-[#1E2761] mb-1">20+</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest">Khóa đào tạo</div>
            </div>
            <div className="text-center md:border-r border-gray-100">
              <div className="text-3xl font-bold text-[#1E2761] mb-1">500+</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest">Học viên</div>
            </div>
            <div className="text-center md:border-r border-gray-100">
              <div className="text-3xl font-bold text-[#1E2761] mb-1">15+</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest">Chuyên gia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1E2761] mb-1">98%</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest">Hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section id="khoa-hoc" className="bg-[#F5F7FA] py-20 px-4">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E2761] mb-4">Các khóa học nghiệp vụ</h2>
              <p className="text-gray-500 max-w-xl">Học từ những người đã làm. Chương trình đào tạo sát với nhu cầu tuyển dụng và vận hành thực tế.</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-white text-[#1E2761] rounded-lg border border-[#CADCFC] hover:border-[#E63946] transition-colors text-sm font-medium">Bán chạy</button>
              <button className="px-6 py-2 bg-white text-[#1E2761] rounded-lg border border-[#CADCFC] hover:border-[#E63946] transition-colors text-sm font-medium">Mới nhất</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productConfig.courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#CADCFC] hover:shadow-xl transition-all duration-500 group flex flex-col h-full">
                <div className="aspect-video relative overflow-hidden bg-gray-200">
                  <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#E63946] text-white text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-widest">
                      {course.category}
                    </span>
                  </div>
                  {course.featured && (
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white/80" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 font-medium uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 24 học viên</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#1E2761] mb-3 group-hover:text-[#E63946] transition-colors leading-tight">{course.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">{course.description}</p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <button className="w-full py-2.5 bg-[#1E2761] text-white rounded-xl text-sm font-bold hover:bg-[#E63946] transition-all">
                      Liên hệ đăng ký
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Masterclass Section Mock */}
      <section className="bg-white py-20 px-4 overflow-hidden">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl">
                <img src="/images/resource-1.jpg" alt="Masterclass" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <span className="text-gold-500 font-bold uppercase tracking-widest text-xs mb-4 block">Sắp ra mắt</span>
                  <h3 className="text-white text-3xl font-serif mb-4">Masterclass: Revenue Management tại Khách sạn 5 sao</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">Học trực tiếp từ Giám đốc kinh doanh với 15 năm kinh nghiệm tại các tập đoàn quốc tế.</p>
                  <button className="flex items-center gap-2 text-white font-medium hover:text-gold-500 transition-colors">
                    Đăng ký nhận thông tin <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#E63946] rounded-full flex items-center justify-center text-white text-center leading-tight shadow-xl z-10 rotate-12">
                <span className="font-bold">ĐỘC QUYỀN<br />TẠI VIỆT NAM</span>
              </div>
            </div>
            
            <div>
              <span className="text-[#E63946] font-bold uppercase tracking-widest text-xs mb-4 block">Premium Experience</span>
              <h2 className="font-serif text-4xl text-[#1E2761] mb-6">CLB Masterclass Series</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Đưa kiến thức của bạn lên một tầm cao mới với chuỗi chương trình Masterclass độc quyền. 
                Không chỉ là học tập, đây là trải nghiệm tư duy chiến lược từ những người đứng đầu ngành.
              </p>
              
              <div className="space-y-6 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#F5F7FA] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-[#1E2761]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1E2761] mb-1">Chứng nhận uy tín</h4>
                    <p className="text-sm text-gray-500">Được công nhận bởi các đối tác lữ hành và khách sạn trong mạng lưới CLB.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#F5F7FA] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[#1E2761]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1E2761] mb-1">Mạng lưới độc quyền</h4>
                    <p className="text-sm text-gray-500">Kết nối trực tiếp với giảng viên và các học viên là quản lý cấp cao.</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full md:w-auto px-10 py-4 bg-[#1E2761] text-white rounded-xl font-bold hover:bg-[#E63946] transition-all shadow-xl">
                Khám phá Expert Series
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SanPhamPage;
