'use client';

import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError('');

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return false;
      }

      router.push('/posts');
      router.refresh();
      return true;
    } catch (error) {
      setError('登入過程中發生錯誤');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError('');

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '註冊失敗');
      }

      // 註冊成功後自動登入
      return await login(email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : '註冊過程中發生錯誤');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (confirm('確定要登出嗎？')) {
      await signOut({ redirect: false });
      router.push('/login');
    }
  };

  return {
    login,
    register,
    logout,
    error,
    isLoading,
  };
}
