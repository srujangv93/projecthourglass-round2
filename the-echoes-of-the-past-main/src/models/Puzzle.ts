export interface IPuzzle {
  id?: string;
  _id?: string;
  audioUrl: string;
  correctAnswer: string;
  acceptedAnswers: string[];
  hint1: string;
  hint2: string;
  rewardLetter: string;
  order: number;
}
