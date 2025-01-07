'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/post';
import { usePosts } from '@/hooks/usePosts';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface PostFormProps {
  postId?: string;
  initialData?: Post;
}

export default function PostForm({ postId, initialData }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const router = useRouter();
  const { createPost, updatePost, error, isLoading } = usePosts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = postId
      ? await updatePost(postId, { title, content })
      : await createPost({ title, content });

    if (success) {
      router.push('/posts');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {postId ? '編輯文章' : '新增文章'}
        </h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="標題"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="mb-4">
            <label className="block mb-2">內容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded h-40"
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" isLoading={isLoading}>
              {postId ? '更新' : '發布'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              取消
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
