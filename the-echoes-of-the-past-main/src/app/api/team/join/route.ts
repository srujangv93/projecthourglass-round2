import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/fileStore';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const { teamName } = await req.json();

    if (!teamName) {
      return NextResponse.json({ error: 'Missing team name' }, { status: 400 });
    }

    const data = await readData();
    const teamId = nanoid(8).toLowerCase();

    const newTeam = {
      name: teamName,
      teamId,
      startTime: new Date(),
      solvedPuzzleIds: [],
      attempts: 0,
      collectedLetters: [],
      isCompleted: false
    };

    data.teams = [...(data.teams || []), newTeam];
    await writeData(data);

    const response = NextResponse.json({ teamId: newTeam.teamId, name: newTeam.name });
    response.cookies.set('teamId', newTeam.teamId, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/'
    });
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
