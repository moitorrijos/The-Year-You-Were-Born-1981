import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateYearStory(year: number): Promise<string> {
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
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      temperature: 0.7,
    }
  });

  return response.text || "I couldn't find the records for that year, but I bet it was amazing.";
}
