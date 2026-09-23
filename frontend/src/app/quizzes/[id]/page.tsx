'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, Calendar, HelpCircle, Check, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';
import { Quiz } from '../../../types/quiz';

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadQuiz = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await api.getQuizById(id);
        setQuiz(data);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load quiz details');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  const handleDelete = async () => {
    if (!quiz) return;
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    setIsDeleting(true);
    try {
      await api.deleteQuiz(quiz.id);
      router.push('/quizzes');
    } catch (err: any) {
      alert(err.message || 'Failed to delete quiz');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-medium">Loading quiz details...</p>
      </div>
    );
  }

  if (errorMessage || !quiz) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Quiz Not Found</h2>
        <p className="text-sm text-slate-500">{errorMessage || 'The requested quiz does not exist.'}</p>
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quizzes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/quizzes"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            aria-label="Back to quizzes"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{quiz.title}</h1>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Created {new Date(quiz.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className="font-medium text-slate-700">
                {quiz.questions?.length || 0} questions
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                Read-only inspection
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Delete quiz"
          aria-label="Delete quiz"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="space-y-4">
        {quiz.questions?.map((question, index) => {
          const typeBadgeText =
            question.type === 'BOOLEAN'
              ? 'Boolean'
              : question.type === 'INPUT'
              ? 'Short Input'
              : 'Checkbox';

          return (
            <div
              key={question.id || index}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-medium text-slate-900 leading-snug">
                    {question.title}
                  </h3>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {typeBadgeText}
                </span>
              </div>

              <div className="pt-2 pl-9">
                {question.type === 'BOOLEAN' && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Options & Correct Answer
                    </p>
                    <div className="flex gap-3">
                      {(question.options && question.options.length > 0
                        ? question.options
                        : [
                            { text: 'True', isCorrect: question.correctAnswer === 'true' },
                            { text: 'False', isCorrect: question.correctAnswer === 'false' },
                          ]
                      ).map((opt, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm ${
                            opt.isCorrect
                              ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-medium'
                              : 'border-slate-200 bg-slate-50 text-slate-500'
                          }`}
                        >
                          <input
                            type="radio"
                            disabled
                            checked={opt.isCorrect}
                            readOnly
                            className="text-emerald-600"
                          />
                          <span>{opt.text}</span>
                          {opt.isCorrect && (
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium ml-1">
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {question.type === 'INPUT' && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Text Answer Field
                    </p>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
                      {question.correctAnswer ? (
                        <div>
                          <span className="text-xs text-slate-400 block mb-0.5">
                            Expected answer:
                          </span>
                          <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                            {question.correctAnswer}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Open text field for respondent input
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {question.type === 'CHECKBOX' && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Answer Choices
                    </p>
                    <div className="space-y-1.5">
                      {question.options?.map((opt, i) => (
                        <div
                          key={opt.id || i}
                          className={`flex items-center justify-between px-3.5 py-2 rounded-lg border text-sm ${
                            opt.isCorrect
                              ? 'border-emerald-400 bg-emerald-50/40 text-emerald-950 font-medium'
                              : 'border-slate-200 bg-slate-50 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              disabled
                              checked={opt.isCorrect}
                              readOnly
                              className="text-emerald-600 rounded border-slate-300"
                            />
                            <span>{opt.text}</span>
                          </div>
                          {opt.isCorrect && (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-medium">
                              <Check className="w-3 h-3" />
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
