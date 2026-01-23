import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export interface CachedStory {
  year: number;
  content: string;
  created_at: string;
}

export async function getCachedStory(year: number): Promise<string | null> {
  try {
    const result = await db.execute({
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
    await db.execute({
      sql: 'INSERT OR REPLACE INTO stories (year, content, created_at) VALUES (?, ?, datetime("now"))',
      args: [year, content],
    });
  } catch (error) {
    console.error('Error caching story:', error);
  }
}
