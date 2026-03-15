import AdminLayout from '@/components/admin/AdminLayout';
import { withAdminAuth } from '@/components/admin/AdminAuthGate';
import ArticleForm from '@/components/admin/ArticleForm';

export default function NewArticlePage() {
  return (
    <AdminLayout title="Bài viết mới">
      <ArticleForm />
    </AdminLayout>
  );
}

export const getServerSideProps = withAdminAuth();
