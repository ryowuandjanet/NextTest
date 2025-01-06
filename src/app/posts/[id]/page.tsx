import { Suspense } from 'react';
import PostContent from './PostContent';

export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <PostContent postId={params.id} />
    </Suspense>
  );
}
