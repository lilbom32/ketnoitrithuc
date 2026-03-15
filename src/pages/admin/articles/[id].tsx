import AdminLayout from '@/components/admin/AdminLayout';
import { withAdminAuth } from '@/components/admin/AdminAuthGate';
import ArticleForm from '@/components/admin/ArticleForm';
import { createAdminClient } from '@/lib/supabase';
import type { ArticleRow } from '@/lib/database.types';

interface EditArticlePageProps {
  article: ArticleRow;
}

export default function EditArticlePage({ article }: EditArticlePageProps) {
  return (
    <AdminLayout title={`Sửa: ${article.title}`}>
      <ArticleForm initial={article} articleId={article.id} />
    </AdminLayout>
  );
}

export const getServerSideProps = withAdminAuth<EditArticlePageProps>(async (ctx) => {
  const id = Number(ctx.params?.id);
  if (isNaN(id)) return { notFound: true };

  const admin = createAdminClient();
  const { data, error } = await admin.from('articles').select('*').eq('id', id).single();

  if (error || !data) return { notFound: true };

  return { props: { article: data as ArticleRow } };
});
