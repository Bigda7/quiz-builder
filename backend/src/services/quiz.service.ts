import { prisma } from '../prisma';
import { CreateQuizDto, QuizListItem } from '../types/quiz.types';

export class QuizService {
  async getAllQuizzes(): Promise<QuizListItem[]> {
    const quizzes = await prisma.quiz.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      questionsCount: q._count.questions,
      createdAt: q.createdAt,
    }));
  }

  async getQuizById(id: string) {
    return prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
          include: {
            options: true,
          },
        },
      },
    });
  }

  async createQuiz(data: CreateQuizDto) {
    return prisma.quiz.create({
      data: {
        title: data.title,
        questions: {
          create: data.questions.map((question, index) => ({
            title: question.title,
            type: question.type,
            order: question.order ?? index,
            correctAnswer: question.correctAnswer ?? null,
            options: question.options && question.options.length > 0
              ? {
                  create: question.options.map((opt) => ({
                    text: opt.text,
                    isCorrect: opt.isCorrect,
                  })),
                }
              : undefined,
          })),
        },
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
          include: {
            options: true,
          },
        },
      },
    });
  }

  async deleteQuiz(id: string): Promise<boolean> {
    const existing = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!existing) {
      return false;
    }

    await prisma.quiz.delete({
      where: { id },
    });

    return true;
  }
}

export const quizService = new QuizService();
