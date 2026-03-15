import AdminLayout from '@/components/admin/AdminLayout';
import { withAdminAuth } from '@/components/admin/AdminAuthGate';
import DocumentForm from '@/components/admin/DocumentForm';
import { createAdminClient } from '@/lib/supabase';
import type { DocumentRow } from '@/lib/database.types';

interface EditDocPageProps {
  document: DocumentRow;
}

export default function EditDocumentPage({ document }: EditDocPageProps) {
  return (
    <AdminLayout title={`Sửa: ${document.title}`}>
      <DocumentForm initial={document} documentId={document.id} />
    </AdminLayout>
  );
}

export const getServerSideProps = withAdminAuth<EditDocPageProps>(async (ctx) => {
  const id = ctx.params?.id as string;
  if (!id) return { notFound: true };

  const admin = createAdminClient();
  const { data, error } = await admin.from('documents').select('*').eq('id', id).single();
  if (error || !data) return { notFound: true };

  return { props: { document: data as DocumentRow } };
});
