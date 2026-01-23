import React, { useState, useCallback } from 'react';
import IntroView from './components/IntroView';
import TimeWarp from './components/TimeWarp';
import StoryView from './components/StoryView';
import { fetchYearStory } from './services/api';
import { AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.INPUT);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [story, setStory] = useState<string>('');

  const handleStartJourney = useCallback(async (year: string) => {
    setSelectedYear(year);
    setState(AppState.TRAVELING);

    // Start fetching story immediately while animation plays
    // We don't await here because we want the animation to run in parallel
    // and we will sync up in the TimeWarp onComplete.
    try {
      const generatedStory = await fetchYearStory(year);
      setStory(generatedStory);
    } catch (error) {
      console.error(error);
      setStory("We encountered a temporal paradox and couldn't retrieve the data for this year.");
    }
  }, []);

  const handleTravelComplete = useCallback(() => {
    setState(AppState.STORY);
  }, []);

  const handleReset = useCallback(() => {
    setState(AppState.INPUT);
    setStory('');
    setSelectedYear('');
  }, []);

  return (
    <>
      {state === AppState.INPUT && (
        <IntroView onStartJourney={handleStartJourney} />
      )}

      {state === AppState.TRAVELING && (
        <TimeWarp 
          targetYear={selectedYear} 
          onTravelComplete={handleTravelComplete} 
        />
      )}

      {state === AppState.STORY && (
        <StoryView 
          story={story || "Retrieving temporal records..."} // Fallback if API is slower than animation
          year={selectedYear}
          onReset={handleReset}
        />
      )}
    </>
  );
};

export default App;
