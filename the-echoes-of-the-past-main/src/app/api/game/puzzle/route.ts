import { NextResponse, NextRequest } from 'next/server';
import { readData } from '@/lib/fileStore';

export async function GET(req: NextRequest) {
  const teamId = req.headers.get('authorization')?.split(' ')[1] || req.cookies.get('teamId')?.value;
  
  if (!teamId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { puzzles, teams } = await readData();
  const team = teams.find((t: any) => t.teamId === teamId);
  
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  const puzzleStatus = puzzles.map((p: any) => ({
    ...p,
    isSolved: (team.solvedPuzzleIds || []).includes(p._id)
  }));

  return NextResponse.json({
    puzzles: puzzleStatus,
    attempts: team.attempts || 0,
    collectedLetters: team.collectedLetters || [],
    teamName: team.name,
  });
}
