import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password === ADMIN_PASSWORD) {
      const token = signToken({ role: 'admin' });
      return NextResponse.json({ token });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
