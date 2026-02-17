export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  CHAT = 'CHAT',
}

export interface QuizState {
  currentQuestion: QuizQuestion | null;
  isLoading: boolean;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  score: number;
  streak: number;
  totalAnswered: number;
}