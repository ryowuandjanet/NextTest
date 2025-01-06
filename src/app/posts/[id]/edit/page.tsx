import { Suspense } from 'react';
import EditPostContent from './EditPostContent';

function EditPostPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <EditPostContent postId={params.id} />
    </Suspense>
  );
}

export default EditPostPage;
