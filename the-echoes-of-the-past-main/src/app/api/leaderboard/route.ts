import { NextResponse } from 'next/server';
import { getDbData } from '@/lib/localdb';

export async function GET() {
  try {
    const db = getDbData();
    const teams = db.teams;

    // Sort teams manually for more complex logic
    const sortedTeams = [...teams].sort((a: any, b: any) => {
      // 1. Completion status
      if (a.isCompleted && !b.isCompleted) return -1;
      if (!a.isCompleted && b.isCompleted) return 1;

      // 2. Number of puzzles solved
      const aSolved = a.solvedPuzzleIds ? a.solvedPuzzleIds.length : 0;
      const bSolved = b.solvedPuzzleIds ? b.solvedPuzzleIds.length : 0;
      if (aSolved !== bSolved) {
        return bSolved - aSolved;
      }

      // 3. Time taken (only if both completed or both at same puzzle)
      const timeA = a.endTime ? (new Date(a.endTime).getTime() - new Date(a.startTime).getTime()) : Infinity;
      const timeB = b.endTime ? (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) : Infinity;
      
      return timeA - timeB;
    });

    return NextResponse.json(sortedTeams.slice(0, 50)); // Return top 50
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
