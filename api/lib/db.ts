import { createClient, Client } from '@libsql/client';

let db: Client | null = null;

function getDb(): Client {
  if (!db) {
    const url = process.env.TYYWB_DB_TURSO_DATABASE_URL;
    const authToken = process.env.TYYWB_DB_TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error('TYYWB_DB_TURSO_DATABASE_URL environment variable is not set');
    }

    db = createClient({ url, authToken });
  }
  return db;
}

export interface CachedStory {
  year: number;
  content: string;
  created_at: string;
}

export async function getCachedStory(year: number): Promise<string | null> {
  try {
    const result = await getDb().execute({
      sql: 'SELECT content FROM stories WHERE year = ?',
      args: [year],
    });

    if (result.rows.length > 0) {
      return result.rows[0].content as string;
    }

    return null;
  } catch (error) {
    console.error('Error fetching cached story:', error);
    return null;
  }
}

export async function cacheStory(year: number, content: string): Promise<void> {
  try {
    await getDb().execute({
      sql: 'INSERT OR REPLACE INTO stories (year, content, created_at) VALUES (?, ?, datetime("now"))',
      args: [year, content],
    });
  } catch (error) {
    console.error('Error caching story:', error);
  }
}
