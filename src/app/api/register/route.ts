import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: '請填寫所有必填欄位' },
        { status: 400 },
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: '該電子郵件已被註冊' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: '用戶註冊成功', user: { id: user._id, name, email } },
      { status: 201 },
    );
  } catch (error) {
    console.error('註冊錯誤:', error);
    return NextResponse.json(
      { message: '註冊過程中發生錯誤' },
      { status: 500 },
    );
  }
}
