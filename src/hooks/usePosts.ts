'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Post, CreatePostData, UpdatePostData } from '@/types/post';

export function usePosts() {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchPosts = useCallback(async (): Promise<Post[]> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/posts');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '獲取文章失敗');
      }

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : '獲取文章失敗');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPost = useCallback(async (id: string): Promise<Post | null> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '獲取文章失敗');
      }

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : '獲取文章失敗');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPost = async (postData: CreatePostData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '創建文章失敗');
      }

      router.push('/posts');
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : '創建文章失敗');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async (
    id: string,
    postData: UpdatePostData,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '更新文章失敗');
      }

      router.push(`/posts/${id}`);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新文章失敗');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      if (!confirm('確定要刪除這篇文章嗎？')) {
        return false;
      }

      setIsLoading(true);
      setError('');

      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '刪除文章失敗');
      }

      router.push('/posts');
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : '刪除文章失敗');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    error,
    isLoading,
  };
}
