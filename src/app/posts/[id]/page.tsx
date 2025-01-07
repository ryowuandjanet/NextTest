import { Suspense } from 'react';
import PostDetail from './PostDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<div className="text-center py-8">載入中...</div>}>
      <PostDetail postId={resolvedParams.id} />
    </Suspense>
  );
}
