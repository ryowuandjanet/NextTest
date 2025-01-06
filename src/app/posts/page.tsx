'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('確定要刪除這篇文章嗎？')) {
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPosts(posts.filter((post) => post._id !== id));
        }
      } catch (error) {
        console.error('刪除失敗:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">文章列表</h1>
        {session && (
          <Link
            href="/posts/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            新增文章
          </Link>
        )}
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">
              {post.content.substring(0, 200)}...
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                作者: {post.author.name}
                <span className="mx-2">•</span>
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <div className="space-x-2">
                <Link
                  href={`/posts/${post._id}`}
                  className="text-blue-500 hover:underline"
                >
                  查看
                </Link>
                {session?.user?.email === post.author.email && (
                  <>
                    <Link
                      href={`/posts/${post._id}/edit`}
                      className="text-green-500 hover:underline"
                    >
                      編輯
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:underline"
                    >
                      刪除
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
