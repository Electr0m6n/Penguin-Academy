export interface User {
  id: string;
  username?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  user_metadata?: {
    username?: string;
    full_name?: string;
    [key: string]: string | number | boolean | null | undefined;
  };
}

export interface Theme {
  id: string;
  name: string;
  colors: string[];
  background: string;
}

export interface ThemeColors {
  correct: string;
  cursor: string;
  error: string;
  typed: string;
  background: string;
}

export interface WpmDataPoint {
  time: number;
  wpm: number;
}

export interface AccuracyDataPoint {
  time: number;
  accuracy: number;
}

export interface LeaderboardEntry {
  username: string;
  wpm: number;
  accuracy: number;
  is_competitive: boolean;
}

export type TestDuration = 15 | 30 | 60 | 120 | 'competitive'; 