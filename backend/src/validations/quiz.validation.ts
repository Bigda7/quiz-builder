import { z } from 'zod';

const optionSchema = z.object({
  text: z.string().trim().min(1, 'Option text cannot be empty'),
  isCorrect: z.boolean().default(false),
});

const questionSchema = z
  .object({
    title: z.string().trim().min(1, 'Question title is required'),
    type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
    order: z.number().int().optional(),
    correctAnswer: z.string().trim().nullable().optional(),
    options: z.array(optionSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'CHECKBOX') {
      if (!data.options || data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Checkbox question must have at least 2 options',
          path: ['options'],
        });
      } else if (!data.options.some((opt) => opt.isCorrect)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Checkbox question must have at least one correct answer',
          path: ['options'],
        });
      }
    }

    if (data.type === 'BOOLEAN') {
      if (!data.options || data.options.length !== 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Boolean question must have True and False options',
          path: ['options'],
        });
      }
    }
  });

export const createQuizSchema = z.object({
  title: z.string().trim().min(1, 'Quiz title is required').max(200, 'Quiz title is too long'),
  questions: z.array(questionSchema).min(1, 'Quiz must have at least one question'),
});
