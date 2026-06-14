import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export async function getDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Return default if file doesn't exist
      return { videos: [], gallery: [], articles: [], memories: [], stats: { totalViews: 0, totalVisitors: 0 } };
    }
    throw error;
  }
}

export async function saveDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}
