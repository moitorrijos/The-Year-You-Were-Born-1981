export enum AppState {
  INPUT = 'INPUT',
  TRAVELING = 'TRAVELING',
  STORY = 'STORY',
}

export interface YearData {
  year: string;
  story: string;
}

export interface TimeWarpProps {
  onTravelComplete: () => void;
  targetYear: string;
}

export interface StoryViewProps {
  story: string;
  year: string;
  onReset: () => void;
}
