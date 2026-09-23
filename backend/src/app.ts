import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import { quizRouter } from './routes/quiz.routes';

export const createApp = (): Application => {
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  );

  app.use(express.json());

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/quizzes', quizRouter);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ error: 'Internal server error', message: err.message });
  });

  return app;
};
