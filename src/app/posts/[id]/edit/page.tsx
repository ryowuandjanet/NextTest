import { Suspense } from 'react';
import EditPostContent from './EditPostContent';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<div className="text-center py-8">載入中...</div>}>
      <EditPostContent postId={resolvedParams.id} />
    </Suspense>
  );
}
