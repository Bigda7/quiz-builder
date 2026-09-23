import { Request, Response } from 'express';
import { quizService } from '../services/quiz.service';
import { createQuizSchema } from '../validations/quiz.validation';

export class QuizController {
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const quizzes = await quizService.getAllQuizzes();
      res.status(200).json(quizzes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve quizzes' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const quiz = await quizService.getQuizById(id);

      if (!quiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
      }

      res.status(200).json(quiz);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve quiz' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = createQuizSchema.safeParse(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.flatten(),
        });
        return;
      }

      const createdQuiz = await quizService.createQuiz(validationResult.data);
      res.status(201).json(createdQuiz);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create quiz' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await quizService.deleteQuiz(id);

      if (!success) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
      }

      res.status(200).json({ message: 'Quiz deleted successfully', id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete quiz' });
    }
  }
}

export const quizController = new QuizController();
