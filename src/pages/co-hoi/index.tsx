import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { Briefcase, GraduationCap, Handshake, Search, MapPin, Building2, Calendar, ArrowRight, Filter, CheckCircle } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { useState } from 'react';
import { createAdminClient } from '@/lib/supabase';
import type { JobRow } from '@/lib/database.types';

type JobCardData = Pick<
  JobRow,
  'id' | 'title' | 'company' | 'location' | 'type' | 'salary_range' | 'contact_email' | 'created_at'
>;

interface Props {
  jobs: JobCardData[];
}

const CoHoiPage: NextPage<Props> = ({ jobs }) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'scholarships' | 'collab'>('jobs');

  const JOBS = [
    { title: 'Quản lý vận hành Tour', company: 'Saigon Tourist', location: 'Quận 1, TP.HCM', type: 'full-time' },
    { title: 'Giảng viên chuyên ngành Khách sạn', company: 'ĐH Văn Lang', location: 'Quận Bình Thạnh', type: 'part-time' },
    { title: 'Chuyên viên Marketing Du lịch', company: 'Mekong Travel', location: 'Cần Thơ', type: 'full-time' },
  ];

  const SCHOLARSHIPS = [
    { title: 'Học bổng Tài năng Du lịch Mekong 2026', provider: 'Câu lạc bộ Tri thức Du lịch' },
    { title: 'Học bổng Thạc sĩ Quản trị Khách sạn tại Thụy Sĩ', provider: 'Học viện Glion' },
  ];

  return (
    <PageLayout>
      <Head>
        <title>Cơ hội Nghề nghiệp & Học bổng | Câu lạc bộ Tri thức Du lịch</title>
        <meta name="description" content="Khám phá các cơ hội việc làm, học bổng và cộng tác chuyên môn trong mạng lưới thành viên Câu lạc bộ Tri thức Du lịch." />
      </Head>

      {/* Hero Section */}
      <section className="bg-white border-b border-[#CADCFC] py-20 px-4">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="text-[#E63946] font-bold uppercase tracking-widest text-xs mb-4 block">Mạng lưới kết nối</span>
            <h1 className="font-serif text-4xl md:text-5xl text-[#1E2761] mb-6">Mở cửa cơ hội chuyển mình</h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Câu lạc bộ Tri thức Du lịch không chỉ là nơi học tập mà còn là cầu nối nghề nghiệp uy tín. 
              Khám phá các vị trí tuyển dụng, chương trình học bổng và dự án cộng tác từ các đối tác hàng đầu.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs / Filter Navigation */}
      <section className="bg-white sticky top-[72px] z-30 shadow-sm border-b border-[#CADCFC]">
        <div className="container-custom">
          <div className="flex overflow-x-auto no-scrollbar py-2">
            <button 
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap font-medium ${activeTab === 'jobs' ? 'border-[#E63946] text-[#E63946]' : 'border-transparent text-gray-500 hover:text-[#1E2761]'}`}
            >
              <Briefcase className="w-5 h-5" /> Việc làm
            </button>
            <button 
              onClick={() => setActiveTab('scholarships')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap font-medium ${activeTab === 'scholarships' ? 'border-[#E63946] text-[#E63946]' : 'border-transparent text-gray-500 hover:text-[#1E2761]'}`}
            >
              <GraduationCap className="w-5 h-5" /> Học bổng
            </button>
            <button 
              onClick={() => setActiveTab('collab')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap font-medium ${activeTab === 'collab' ? 'border-[#E63946] text-[#E63946]' : 'border-transparent text-gray-500 hover:text-[#1E2761]'}`}
            >
              <Handshake className="w-5 h-5" /> Cộng tác
            </button>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="bg-[#F5F7FA] py-16 px-4">
        <div className="container-custom">
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Vị trí, công ty..." className="w-full pl-10 pr-4 py-3 bg-white border border-[#CADCFC] rounded-xl outline-none focus:ring-2 focus:ring-[#E63946]/50" />
                </div>
                <div className="relative w-full md:w-64">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select className="w-full pl-10 pr-4 py-3 bg-white border border-[#CADCFC] rounded-xl outline-none appearance-none">
                    <option>Toàn quốc</option>
                    <option>TP. Hồ Chí Minh</option>
                    <option>Cần Thơ</option>
                    <option>Vũng Tàu</option>
                  </select>
                </div>
              </div>

              {(jobs.length > 0 ? jobs : JOBS).map((job, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-[#CADCFC] hover:border-[#E63946] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-[#F5F7FA] rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-[#E63946]/5 transition-colors">
                      <Building2 className="w-8 h-8 text-[#1E2761]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#1E2761] mb-1 group-hover:text-[#E63946] transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] uppercase font-bold tracking-wider">{job.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end border-t md:border-t-0 pt-4 md:pt-0">
                    <button className="px-6 py-2.5 bg-[#1E2761] text-white rounded-lg font-medium hover:bg-[#E63946] transition-colors">
                      Liên hệ tìm hiểu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'scholarships' && (
            <div className="grid md:grid-cols-2 gap-8">
              {SCHOLARSHIPS.map((sc, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-[#CADCFC] shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                    <GraduationCap className="w-12 h-12 text-[#F5F7FA] group-hover:text-[#E63946]/10 transition-colors" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#1E2761] mb-6 pr-10">{sc.title}</h3>
                  <div className="mb-8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Đơn vị:</span>
                      <span className="font-medium text-[#1E2761]">{sc.provider}</span>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-[#F5F7FA] text-[#1E2761] rounded-xl font-medium group-hover:bg-[#1E2761] group-hover:text-white transition-all flex items-center justify-center gap-2">
                    Liên hệ tư vấn <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'collab' && (
            <div className="bg-[#1E2761] rounded-[2rem] p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#E63946]/10 rounded-full blur-[100px]" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="font-serif text-3xl md:text-4xl mb-6">Trở thành một phần của đội ngũ chuyên gia</h2>
                <p className="text-white/60 text-lg leading-relaxed mb-10">
                  Chúng tôi luôn chào đón các chuyên gia, giảng viên và những người có tâm huyết 
                  muốn chia sẻ tri thức cho cộng đồng du lịch Việt Nam.
                </p>
                <div className="grid sm:grid-cols-2 gap-6 mb-10 text-sm">
                  {[
                    'Viết bài phân tích chuyên môn',
                    'Biên soạn học liệu học thuật',
                    'Giảng dạy Masterclass',
                    'Cố vấn chiến lược dự án',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-gold-500" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <button className="px-10 py-4 bg-[#E63946] text-white rounded-2xl font-bold hover:bg-[#E63946]/90 transition-all shadow-xl">
                  Gửi hồ sơ cộng tác
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const admin = createAdminClient();
  const { data } = await admin
    .from('jobs')
    .select('id, title, company, location, type, salary_range, contact_email, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .returns<JobCardData[]>();

  return {
    props: { jobs: data ?? [] },
    revalidate: 300, // 5 minutes
  };
};

export default CoHoiPage;
