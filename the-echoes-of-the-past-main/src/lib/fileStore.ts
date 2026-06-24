import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export async function readData() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { puzzles: [], settings: { googleFormUrl: '', teamIdFieldId: '', answerFieldId: '' } };
  }
}

export async function writeData(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}
