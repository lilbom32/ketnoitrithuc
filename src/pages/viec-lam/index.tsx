/**
 * /viec-lam — Job Board
 *
 * Lists open positions in the travel industry.
 * Filtered by job type (full-time / part-time / freelance).
 * ISR revalidates every 5 minutes.
 */
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { createAdminClient } from '@/lib/supabase';
import type { JobRow } from '@/lib/database.types';

type JobCard = Pick<
  JobRow,
  'id' | 'title' | 'company' | 'location' | 'type' | 'salary_range' | 'contact_email' | 'created_at'
>;

interface Props {
  jobs: JobCard[];
}

const TYPE_LABELS: Record<JobRow['type'], string> = {
  'full-time':  'Toàn thời gian',
  'part-time':  'Bán thời gian',
  'freelance':  'Freelance',
};

const TYPE_COLORS: Record<JobRow['type'], string> = {
  'full-time':  'bg-[#1E2761] text-white',
  'part-time':  'bg-[#CADCFC] text-[#1E2761]',
  'freelance':  'bg-amber-100 text-amber-800',
};

const FILTERS = [
  { key: 'all',        label: 'Tất cả' },
  { key: 'full-time',  label: 'Toàn thời gian' },
  { key: 'part-time',  label: 'Bán thời gian' },
  { key: 'freelance',  label: 'Freelance' },
] as const;

const JobBoard: NextPage<Props> = ({ jobs }) => {
  const [activeType, setActiveType] = useState<'all' | JobRow['type']>('all');

  const filtered = activeType === 'all'
    ? jobs
    : jobs.filter((j) => j.type === activeType);

  return (
    <>
      <Head>
        <title>Cơ Hội Việc Làm | CLB Kết nối tri thức</title>
        <meta
          name="description"
          content="Cơ hội việc làm trong ngành du lịch và khách sạn dành cho các chuyên gia."
        />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-[#1E2761] text-white py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Cơ Hội Việc Làm</h1>
            <p className="text-white/70 text-lg max-w-xl">
              Vị trí tuyển dụng từ các doanh nghiệp du lịch, khách sạn và MICE hàng đầu.
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="max-w-5xl mx-auto px-4 flex gap-1 py-3">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveType(f.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeType === f.key
                    ? 'bg-[#1E2761] text-white'
                    : 'text-gray-500 hover:text-[#1E2761]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* Job list */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          {filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-20">Chưa có vị trí tuyển dụng nào.</p>
          ) : (
            <div className="space-y-4">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

function JobCard({ job }: { job: JobCard }) {
  const date = new Date(job.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="border border-gray-100 rounded-xl p-6 hover:border-[#CADCFC] hover:shadow-sm transition-all">
      <div className="flex flex-wrap items-start gap-3 mb-3">
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${TYPE_COLORS[job.type]}`}>
          {TYPE_LABELS[job.type]}
        </span>
        {job.salary_range && (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-700">
            {job.salary_range}
          </span>
        )}
      </div>

      <h2 className="font-serif text-xl mb-1">{job.title}</h2>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
        <span className="font-medium text-gray-700">{job.company}</span>
        {job.location && <span>{job.location}</span>}
        <span>{date}</span>
      </div>

      {job.contact_email && (
        <a
          href={`mailto:${job.contact_email}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E2761] text-white text-sm font-medium hover:bg-[#1E2761]/90 transition-colors"
        >
          Ứng tuyển →
        </a>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const admin = createAdminClient();
  const { data } = await admin
    .from('jobs')
    .select('id, title, company, location, type, salary_range, contact_email, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .returns<JobCard[]>();

  return {
    props: { jobs: data ?? [] },
    revalidate: 300, // 5 minutes
  };
};

export default JobBoard;
