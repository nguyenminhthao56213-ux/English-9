
export interface Message {
  role: 'user' | 'model';
  parts: { text?: string; inlineData?: { data: string; mimeType: string } }[];
}

export interface GrammarError {
  error: string;
  correction: string;
  explanation: string;
  unit: number;
}

export interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface StudyProgress {
  unit: number;
  title: string;
  score: number;
  totalQuestions: number;
  lastAttempt: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  GRAMMAR_CHECK = 'grammar_check',
  EXERCISES = 'exercises',
  TUTOR = 'tutor',
  LIBRARY = 'library'
}
