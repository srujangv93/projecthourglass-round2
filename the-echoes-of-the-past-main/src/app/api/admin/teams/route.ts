import { NextResponse } from 'next/server';
import { getDbData } from '@/lib/localdb';
import { verifyToken } from '@/lib/auth';

function isAdmin(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  const decoded: any = verifyToken(token);
  return decoded && decoded.role === 'admin';
}

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const db = getDbData();
  const teams = [...db.teams].reverse(); // pseudo sort by createdAt desc assuming appended
  return NextResponse.json(teams);
}
