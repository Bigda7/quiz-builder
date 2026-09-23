export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface OptionDto {
  text: string;
  isCorrect: boolean;
}

export interface QuestionDto {
  title: string;
  type: QuestionType;
  order?: number;
  correctAnswer?: string | null;
  options?: OptionDto[];
}

export interface CreateQuizDto {
  title: string;
  questions: QuestionDto[];
}

export interface QuizListItem {
  id: string;
  title: string;
  questionsCount: number;
  createdAt: Date;
}
