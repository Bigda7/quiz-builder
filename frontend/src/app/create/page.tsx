'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '../../services/api';
import { QuestionType } from '../../types/quiz';

const optionSchema = z.object({
  text: z.string().trim().min(1, 'Option text cannot be empty'),
  isCorrect: z.boolean().default(false),
});

const questionSchema = z
  .object({
    title: z.string().trim().min(1, 'Question title is required'),
    type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
    correctAnswer: z.string().trim().nullable().optional(),
    options: z.array(optionSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'CHECKBOX') {
      if (data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Checkbox question must have at least 2 options',
          path: ['options'],
        });
      } else if (!data.options.some((opt) => opt.isCorrect)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one option must be selected as correct',
          path: ['options'],
        });
      }
    }
    if (data.type === 'BOOLEAN') {
      if (data.options.length !== 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Boolean question must have True and False options',
          path: ['options'],
        });
      }
    }
  });

const quizFormSchema = z.object({
  title: z.string().trim().min(1, 'Quiz title is required').max(200, 'Title is too long'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

type QuizFormData = z.infer<typeof quizFormSchema>;

export default function CreateQuizPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: '',
      questions: [
        {
          title: '',
          type: 'BOOLEAN',
          correctAnswer: 'true',
          options: [
            { text: 'True', isCorrect: true },
            { text: 'False', isCorrect: false },
          ],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchedQuestions = watch('questions');

  const handleAddQuestion = () => {
    append({
      title: '',
      type: 'BOOLEAN',
      correctAnswer: 'true',
      options: [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false },
      ],
    });
  };

  const handleTypeChange = (index: number, newType: QuestionType) => {
    setValue(`questions.${index}.type`, newType);
    if (newType === 'BOOLEAN') {
      setValue(`questions.${index}.correctAnswer`, 'true');
      setValue(`questions.${index}.options`, [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false },
      ]);
    } else if (newType === 'CHECKBOX') {
      setValue(`questions.${index}.correctAnswer`, null);
      setValue(`questions.${index}.options`, [
        { text: 'Option 1', isCorrect: true },
        { text: 'Option 2', isCorrect: false },
      ]);
    } else if (newType === 'INPUT') {
      setValue(`questions.${index}.options`, []);
      setValue(`questions.${index}.correctAnswer`, '');
    }
  };

  const handleAddCheckboxOption = (qIndex: number) => {
    const currentOptions = watchedQuestions[qIndex]?.options || [];
    setValue(`questions.${qIndex}.options`, [
      ...currentOptions,
      { text: `Option ${currentOptions.length + 1}`, isCorrect: false },
    ]);
  };

  const handleRemoveCheckboxOption = (qIndex: number, optIndex: number) => {
    const currentOptions = watchedQuestions[qIndex]?.options || [];
    if (currentOptions.length <= 2) {
      alert('A multiple choice question needs at least 2 options');
      return;
    }
    const updated = currentOptions.filter((_, idx) => idx !== optIndex);
    setValue(`questions.${qIndex}.options`, updated);
  };

  const onSubmit = async (data: QuizFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await api.createQuiz({
        title: data.title,
        questions: data.questions.map((q, idx) => ({
          title: q.title,
          type: q.type,
          order: idx,
          correctAnswer: q.correctAnswer,
          options: q.options,
        })),
      });

      router.push('/quizzes');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create quiz');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Link
          href="/quizzes"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          aria-label="Back to quizzes"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quiz Builder</h1>
          <p className="text-sm text-slate-500">
            Define questions and configure options for Boolean, Short Text, or Checkbox types.
          </p>
        </div>
      </div>

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <label htmlFor="quiz-title" className="block text-sm font-semibold text-slate-900">
            Quiz Title <span className="text-red-500">*</span>
          </label>
          <input
            id="quiz-title"
            type="text"
            placeholder="e.g., Fundamentals of React Architecture"
            {...register('title')}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          {errors.title && (
            <p className="text-xs text-red-600 font-medium">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Questions</h2>
            <span className="text-xs font-medium text-slate-500">
              Total questions: {fields.length}
            </span>
          </div>

          {fields.map((field, qIndex) => {
            const questionType = watchedQuestions[qIndex]?.type || 'BOOLEAN';
            const qError = errors.questions?.[qIndex];

            return (
              <div
                key={field.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      {qIndex + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">Question Settings</span>
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(qIndex)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Remove question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Question Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter question prompt..."
                    {...register(`questions.${qIndex}.title`)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  {qError?.title && (
                    <p className="text-xs text-red-600 mt-1">{qError.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Question Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['BOOLEAN', 'INPUT', 'CHECKBOX'] as QuestionType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleTypeChange(qIndex, type)}
                        className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition ${
                          questionType === type
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {type === 'BOOLEAN' && 'Boolean (True / False)'}
                        {type === 'INPUT' && 'Short Input'}
                        {type === 'CHECKBOX' && 'Checkbox (Multiple)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  {questionType === 'BOOLEAN' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-600">
                        Correct Answer
                      </label>
                      <div className="flex gap-4">
                        {[
                          { label: 'True', val: 'true' },
                          { label: 'False', val: 'false' },
                        ].map((choice) => {
                          const isSelected =
                            watchedQuestions[qIndex]?.correctAnswer === choice.val;
                          return (
                            <label
                              key={choice.val}
                              className={`flex items-center gap-2.5 px-4 py-2 rounded-lg border text-sm cursor-pointer transition ${
                                isSelected
                                  ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900 font-medium'
                                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`boolean-choice-${qIndex}`}
                                checked={isSelected}
                                onChange={() => {
                                  setValue(`questions.${qIndex}.correctAnswer`, choice.val);
                                  setValue(`questions.${qIndex}.options`, [
                                    { text: 'True', isCorrect: choice.val === 'true' },
                                    { text: 'False', isCorrect: choice.val === 'false' },
                                  ]);
                                }}
                                className="text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>{choice.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {questionType === 'INPUT' && (
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600">
                        Expected Answer (Optional reference)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., const, 42, or short phrase..."
                        {...register(`questions.${qIndex}.correctAnswer`)}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                      <p className="text-xs text-slate-400">
                        This question will render as an open short-answer text field.
                      </p>
                    </div>
                  )}

                  {questionType === 'CHECKBOX' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-slate-600">
                          Options & Correct Answers
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddCheckboxOption(qIndex)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Option
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(watchedQuestions[qIndex]?.options || []).map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={opt.isCorrect}
                              onChange={(e) => {
                                setValue(
                                  `questions.${qIndex}.options.${optIdx}.isCorrect`,
                                  e.target.checked,
                                );
                              }}
                              title="Mark as correct answer"
                              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                            />
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => {
                                setValue(
                                  `questions.${qIndex}.options.${optIdx}.text`,
                                  e.target.value,
                                );
                              }}
                              placeholder={`Option ${optIdx + 1}`}
                              className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            />
                            {(watchedQuestions[qIndex]?.options || []).length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCheckboxOption(qIndex, optIdx)}
                                className="p-1.5 text-slate-400 hover:text-red-500 rounded-md transition"
                                title="Delete option"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {qError?.options && (
                        <p className="text-xs text-red-600">
                          {qError.options.message || 'Please configure valid options'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition bg-white/50 hover:bg-indigo-50/20"
          >
            <Plus className="w-4 h-4" />
            Add Another Question
          </button>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <Link
            href="/quizzes"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Quiz...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Save & Publish Quiz
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
