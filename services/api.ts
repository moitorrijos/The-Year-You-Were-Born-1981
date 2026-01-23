import { GoogleGenAI } from "@google/genai";

interface StoryResponse {
  story: string;
  source: 'cache' | 'generated';
}

// Fallback for local development when API route isn't available
async function generateStoryDirectly(year: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('No API key available for local development');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Tell me a captivating, upbeat, and nostalgic story about the year ${year}.
    Imagine you are a narrator taking the user back in time.

    Include the following details seamlessly in the narrative:
    1. The general vibe or mood of that year.
    2. The winner of the Billboard Music Awards or top charting artist.
    3. The best-selling book or a significant literary release.
    4. The most listened-to song (Song of the Summer or Year).
    5. The most watched or highest-grossing movie.
    6. Significant events in politics, science, and the arts.
    7. CRITICAL: Explicitly mention whether this was before or during the early days of technologies we take for granted today (e.g., "This was a time before the iPhone existed," or "The internet was just a baby," or "Color TV was a luxury").

    Format the response as a continuous, engaging story. Do not use Markdown headers (like ##). You can use bolding for emphasis on titles or names. Break it into bite-sized paragraphs for easy reading.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      temperature: 0.7,
    }
  });

  return response.text || "I couldn't find the records for that year, but I bet it was amazing.";
}

export async function fetchYearStory(year: string): Promise<string> {
  try {
    const response = await fetch(`/api/story?year=${encodeURIComponent(year)}`);

    // Check if response is JSON (API route exists)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // API route not available (local dev) - use direct Gemini call
      console.log('API route not available, using direct Gemini call');
      return generateStoryDirectly(year);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Failed to fetch story');
    }

    const data: StoryResponse = await response.json();
    return data.story;
  } catch (error) {
    // Network error or API route doesn't exist - fallback to direct call
    if (error instanceof TypeError || (error instanceof Error && error.message.includes('JSON'))) {
      console.log('Falling back to direct Gemini call');
      return generateStoryDirectly(year);
    }
    throw error;
  }
}
