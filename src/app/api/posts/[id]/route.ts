import { connectDB } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

// 獲取單個文章
export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    // 等待參數解析
    const id = await Promise.resolve(context.params.id);

    if (!id) {
      return NextResponse.json({ error: '文章ID不存在' }, { status: 400 });
    }

    await connectDB();

    const post = await Post.findById(id).populate('author', 'name email');

    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('獲取文章失敗:', error);
    return NextResponse.json({ error: '獲取文章失敗' }, { status: 500 });
  }
}

// 更新文章
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: '文章ID不存在' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    const { title, content } = await request.json();
    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    if (post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: '無權限修改此文章' }, { status: 403 });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true },
    ).populate('author', 'name email');

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('更新文章失敗:', error);
    return NextResponse.json({ error: '更新文章失敗' }, { status: 500 });
  }
}

// 刪除文章
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: '文章ID不存在' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    if (post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: '無權限刪除此文章' }, { status: 403 });
    }

    await Post.findByIdAndDelete(id);
    return NextResponse.json({ message: '文章已刪除成功' });
  } catch (error) {
    console.error('刪除文章失敗:', error);
    return NextResponse.json({ error: '刪除文章失敗' }, { status: 500 });
  }
}
