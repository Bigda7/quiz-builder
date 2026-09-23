import { CreateQuizInput, Quiz, QuizListItem } from '../types/quiz';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorData: any = null;
    try {
      errorData = await response.json();
    } catch {
      // ignore json parse error
    }
    const message = errorData?.error || errorData?.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, errorData?.details);
  }

  return response.json();
}

export const api = {
  getQuizzes: async (): Promise<QuizListItem[]> => {
    return request<QuizListItem[]>('/quizzes', { cache: 'no-store' });
  },

  getQuizById: async (id: string): Promise<Quiz> => {
    return request<Quiz>(`/quizzes/${id}`, { cache: 'no-store' });
  },

  createQuiz: async (data: CreateQuizInput): Promise<Quiz> => {
    return request<Quiz>('/quizzes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteQuiz: async (id: string): Promise<{ message: string; id: string }> => {
    return request<{ message: string; id: string }>(`/quizzes/${id}`, {
      method: 'DELETE',
    });
  },
};
