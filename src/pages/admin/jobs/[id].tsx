import AdminLayout from '@/components/admin/AdminLayout';
import { withAdminAuth } from '@/components/admin/AdminAuthGate';
import JobForm from '@/components/admin/JobForm';
import { createAdminClient } from '@/lib/supabase';
import type { JobRow } from '@/lib/database.types';

interface EditJobPageProps {
  job: JobRow;
}

export default function EditJobPage({ job }: EditJobPageProps) {
  return (
    <AdminLayout title={`Sửa: ${job.title}`}>
      <JobForm initial={job} jobId={job.id} />
    </AdminLayout>
  );
}

export const getServerSideProps = withAdminAuth<EditJobPageProps>(async (ctx) => {
  const id = Number(ctx.params?.id);
  if (isNaN(id)) return { notFound: true };

  const admin = createAdminClient();
  const { data, error } = await admin.from('jobs').select('*').eq('id', id).single();
  if (error || !data) return { notFound: true };

  return { props: { job: data as JobRow } };
});
