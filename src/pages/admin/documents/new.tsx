import AdminLayout from '@/components/admin/AdminLayout';
import { withAdminAuth } from '@/components/admin/AdminAuthGate';
import DocumentForm from '@/components/admin/DocumentForm';

export default function NewDocumentPage() {
  return (
    <AdminLayout title="Tài nguyên mới">
      <DocumentForm />
    </AdminLayout>
  );
}

export const getServerSideProps = withAdminAuth();
