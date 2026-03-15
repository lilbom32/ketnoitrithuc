import AdminLayout from '@/components/admin/AdminLayout';
import { withAdminAuth } from '@/components/admin/AdminAuthGate';
import JobForm from '@/components/admin/JobForm';

export default function NewJobPage() {
  return (
    <AdminLayout title="Tin tuyển dụng mới">
      <JobForm />
    </AdminLayout>
  );
}

export const getServerSideProps = withAdminAuth();
