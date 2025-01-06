'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    if (confirm('確定要登出嗎？')) {
      await signOut({ redirect: false });
      router.push('/login');
    }
  };

  // 如果沒有登入，不顯示導航欄
  if (!session) {
    return null;
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/posts" className="text-xl font-bold">
          部落格
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/posts" className="hover:text-gray-300">
            文章列表
          </Link>
          <Link href="/posts/new" className="hover:text-gray-300">
            新增文章
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
