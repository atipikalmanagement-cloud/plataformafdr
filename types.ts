
export enum ExerciseType {
  QUALIFY = 'Qualify call',
  COLD_QUALIFY = 'Cold Qualify call',
  EMOTION = 'Emotion Sales call',
  PROPOSAL = 'Proposal Sales Call',
  OBJECTIONS = 'Objections sales call',
}

export enum Difficulty {
  EASY = 'Fácil',
  MEDIUM = 'Médio',
  DIFFICULT = 'Difícil',
}

export type DiscType = 'D' | 'I' | 'S' | 'C';

export interface DiscProfile {
    type: DiscType;
    label: string;
    description: string;
    challengeStrategy: string;
}

export type Theme = 'dark' | 'light';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    brand: string;
    avatarUrl: string;
    joinedDate: string;
    discProfile?: DiscProfile;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  title: string;
  description: string;
}

export interface Transcript {
  speaker: 'user' | 'ai';
  text: string;
}

export interface AnalysisResult {
    score: number;
    isQualified: boolean;
    summary: string;
    failedPoints: string[];
    nextSteps: string[];
    feedback?: string; // Legacy support
}

export interface ScenarioData {
    name: string;
    gender: 'male' | 'female';
    avatarUrl: string;
    experience?: string;
    revenue?: string;
    brand?: string;
    propertiesAcquired?: string;
    digitalAdoption?: string;
    dreamOrFear?: string;
    initialPhrase: string;
    context: string;
}

export interface Recording {
    id: string;
    userId: string;
    date: string;
    exercise: Exercise;
    difficulty: Difficulty;
    transcript: Transcript[];
    analysis: AnalysisResult;
    userAudioUrl: string;
    aiAudioUrl: string;
}
