export interface ITeam {
  id?: string;
  _id?: string;
  name: string;
  teamId: string;
  solvedPuzzleIds: string[];
  attempts: number;
  startTime: Date | string;
  endTime?: Date | string;
  timeTaken?: number; // Time taken in seconds
  score: number;
  isCompleted: boolean;
  collectedLetters: string[];
  finalWordSolved: boolean;
}
