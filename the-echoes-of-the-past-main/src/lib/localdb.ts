import fs from 'fs';
import path from 'path';
import { ITeam } from '../models/Team';
import { IPuzzle } from '../models/Puzzle';
import { ISettings } from '../models/Settings';

const DB_FILE = path.join(process.cwd(), 'data.json');

export interface LocalDbData {
  teams: ITeam[];
  puzzles: IPuzzle[];
  settings: ISettings | null;
}

const defaultData: LocalDbData = {
  teams: [],
  puzzles: [],
  settings: {
    attemptsPerPuzzle: 10,
    timeLimit: 300,
    completionCodePrefix: 'MEMORY',
    adminPasswordHash: '',
    themeColor: '#00E5FF',
    targetWord: 'MEMORY',
    masterAudioUrl: '',
    id: 'default'
  } as ISettings
};

export function getDbData(): LocalDbData {
  if (!fs.existsSync(DB_FILE)) {
    saveDbData(defaultData);
    return defaultData;
  }
  try {
    const rawData = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading DB_FILE:', error);
    return defaultData;
  }
}

export function saveDbData(data: LocalDbData): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to DB_FILE:', error);
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
