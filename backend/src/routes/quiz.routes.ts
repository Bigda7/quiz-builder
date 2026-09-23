import { Router } from 'express';
import { quizController } from '../controllers/quiz.controller';

export const quizRouter = Router();

quizRouter.get('/', (req, res) => quizController.getAll(req, res));
quizRouter.get('/:id', (req, res) => quizController.getById(req, res));
quizRouter.post('/', (req, res) => quizController.create(req, res));
quizRouter.delete('/:id', (req, res) => quizController.delete(req, res));
