import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCachedStory, cacheStory } from './lib/db';
import { generateYearStory } from './lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const yearParam = req.query.year;

  if (!yearParam || typeof yearParam !== 'string') {
    return res.status(400).json({ error: 'Year parameter is required' });
  }

  const year = parseInt(yearParam, 10);
  const currentYear = new Date().getFullYear();

  if (isNaN(year) || year < 1900 || year > currentYear) {
    return res.status(400).json({
      error: `Year must be between 1900 and ${currentYear}`
    });
  }

  try {
    // Check cache first
    const cachedStory = await getCachedStory(year);

    if (cachedStory) {
      return res.status(200).json({
        story: cachedStory,
        source: 'cache'
      });
    }

    // Cache miss - generate new story
    const generatedStory = await generateYearStory(year);

    // Store in cache (don't await to speed up response)
    cacheStory(year, generatedStory).catch(err =>
      console.error('Failed to cache story:', err)
    );

    return res.status(200).json({
      story: generatedStory,
      source: 'generated'
    });
  } catch (error) {
    console.error('Error in story handler:', error);
    return res.status(500).json({
      error: 'Failed to retrieve story'
    });
  }
}
