import { connectDB } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

// 獲取所有文章
export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('獲取文章失敗:', error);
    return NextResponse.json({ error: '獲取文章失敗' }, { status: 500 });
  }
}

// 創建新文章
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('完整的session對象:', JSON.stringify(session, null, 2));

    if (!session || !session.user) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }

    if (!session.user.id) {
      console.log('用戶ID缺失，session.user:', session.user);
      return NextResponse.json({ error: '無法獲取用戶ID' }, { status: 400 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: '標題和內容都是必需的' },
        { status: 400 },
      );
    }

    await connectDB();

    const post = await Post.create({
      title,
      content,
      author: session.user.id, // 移除 toString()
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name email',
    );

    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error) {
    console.error('創建文章失敗:', error);
    return NextResponse.json(
      {
        error: '創建文章失敗',
        details: error instanceof Error ? error.message : '未知錯誤',
        session: 'Session 驗證失敗',
      },
      { status: 500 },
    );
  }
}
