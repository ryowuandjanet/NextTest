'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/post';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/Button';

export default function PostDetail({ postId }: { postId: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { fetchPost, deletePost, error, isLoading } = usePosts();

  useEffect(() => {
    const loadPost = async () => {
      const data = await fetchPost(postId);
      setPost(data);
    };
    loadPost();
  }, [fetchPost, postId]);

  const handleDelete = async () => {
    if (await deletePost(postId)) {
      router.push('/posts');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">載入中...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!post) {
    return <div className="text-center py-8">文章不存在</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-8">
          <p>作者: {post.author?.name || '未知作者'}</p>
          <p>發布時間: {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="prose max-w-none mb-8">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => router.push('/posts')}>
            返回列表
          </Button>

          {session?.user?.email === post.author?.email && (
            <>
              <Button
                variant="primary"
                onClick={() => router.push(`/posts/${post._id}/edit`)}
              >
                編輯
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                刪除
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
