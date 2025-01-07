'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/posts/PostForm';
import { usePosts } from '@/hooks/usePosts';
import type { Post } from '@/types/post';

export default function EditPostContent({ postId }: { postId: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();
  const { fetchPost, error, isLoading } = usePosts();

  useEffect(() => {
    const loadPost = async () => {
      const data = await fetchPost(postId);
      if (!data) {
        router.push('/posts');
        return;
      }
      setPost(data);
    };
    loadPost();
  }, [fetchPost, postId, router]);

  if (isLoading) {
    return <div className="text-center py-8">載入中...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!post) {
    return null;
  }

  return <PostForm postId={postId} initialData={post} />;
}
