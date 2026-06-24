import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/fileStore';
import { verifyToken } from '@/lib/auth';

function isAdmin(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  const decoded: any = verifyToken(token);
  return decoded && decoded.role === 'admin';
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const db = await readData();
    db.teams = [];
    await writeData(db);
    return NextResponse.json({ success: true, message: 'All analytics cleared' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
