'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function PostContent({ postId }: { postId: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        const data = await response.json();

        if (response.ok) {
          setPost(data);
        } else {
          console.error('獲取文章失敗:', data.error);
        }
      } catch (error) {
        console.error('獲取文章時發生錯誤:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!confirm('確定要刪除這篇文章嗎？')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/posts');
      } else {
        const data = await response.json();
        console.error('刪除失敗:', data.error);
      }
    } catch (error) {
      console.error('刪除文章時發生錯誤:', error);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">載入中...</div>;
  }

  if (!post) {
    return <div className="container mx-auto px-4 py-8">文章不存在</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-8">
          <p>作者: {post.author.name}</p>
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
          <button
            onClick={() => router.push('/posts')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            返回列表
          </button>

          {session?.user?.email === post.author.email && (
            <>
              <button
                onClick={() => router.push(`/posts/${post._id}/edit`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                編輯
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                刪除
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
