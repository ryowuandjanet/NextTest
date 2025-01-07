'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Post } from '@/types/post';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/Button';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const { fetchPosts, deletePost, error } = usePosts();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (await deletePost(id)) {
      setPosts(posts.filter((post) => post._id !== id));
    }
  };

  if (loading) {
    return <div className="text-center py-8">載入中...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">文章列表</h1>
        <Button onClick={() => (window.location.href = '/posts/new')}>
          新增文章
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">還沒有任何文章</div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">
                <Link
                  href={`/posts/${post._id}`}
                  className="hover:text-blue-500"
                >
                  {post.title}
                </Link>
              </h2>
              <div className="text-gray-600 mb-4">
                <p>作者: {post.author?.name || '未知作者'}</p>
                <p>發布時間: {new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-gray-700 mb-4">
                {post.content.length > 200
                  ? `${post.content.substring(0, 200)}...`
                  : post.content}
              </p>
              {session?.user?.email === post.author?.email && (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() =>
                      (window.location.href = `/posts/${post._id}/edit`)
                    }
                  >
                    編輯
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(post._id)}
                  >
                    刪除
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
