export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface Option {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id?: string;
  title: string;
  type: QuestionType;
  order?: number;
  correctAnswer?: string | null;
  options?: Option[];
}

export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  questions: Question[];
}

export interface QuizListItem {
  id: string;
  title: string;
  questionsCount: number;
  createdAt: string;
}

export interface CreateQuizInput {
  title: string;
  questions: {
    title: string;
    type: QuestionType;
    order?: number;
    correctAnswer?: string | null;
    options?: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}
