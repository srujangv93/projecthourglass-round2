import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/fileStore';

export async function GET() {
  const { puzzles } = await readData();
  return NextResponse.json(puzzles);
}

export async function POST(req: Request) {
  try {
    const { puzzles } = await req.json();
    const data = await readData();
    data.puzzles = puzzles;
    await writeData(data);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
