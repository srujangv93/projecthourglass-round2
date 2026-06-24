export interface ISettings {
  id?: string;
  _id?: string;
  attemptsPerPuzzle: number;
  timeLimit: number; // in seconds
  completionCodePrefix: string;
  adminPasswordHash: string;
  themeColor: string;
  targetWord: string;
  masterAudioUrl: string;
}
